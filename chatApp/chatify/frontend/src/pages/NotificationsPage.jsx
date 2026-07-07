import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  acceptFriendRequest, 
  getFriendRequests, 
  getUnreadMessages, 
  markMessageAsRead 
} from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  // Friend requests
  const { data: friendRequests, isLoading, isError } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  // Messages
  const { data: unreadMessages = [], isFetching: isFetchingMsgs } = useQuery({
    queryKey: ["unreadMessages"],
    queryFn: getUnreadMessages,
    refetchInterval: 10000, // 🔄 auto-refresh every 10s
  });

  const { mutate: markReadMutation } = useMutation({
    mutationFn: markMessageAsRead,
    onSuccess: (_, msgId) => {
      // 🔑 Optimistic update: remove the message locally
      queryClient.setQueryData(["unreadMessages"], (old = []) =>
        old.filter((m) => m._id !== msgId)
      );
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  // 🔑 Handle errors
  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load notifications. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* FRIEND REQUESTS */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img src={request.sender.profilePic} alt={request.sender.fullName} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED FRIEND REQS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                            <p className="text-sm my-1">
                              {notification.recipient.fullName} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* UNREAD MESSAGES */}
            {isFetchingMsgs ? (
              <p className="text-sm text-center opacity-60">Refreshing messages…</p>
            ) : unreadMessages.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquareIcon className="h-5 w-5 text-info" />
                  New Messages
                  <span className="badge badge-info ml-2">{unreadMessages.length}</span>
                </h2>

                <div className="space-y-3">
                  {unreadMessages.map((msg) => (
                    <div key={msg._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4 flex items-start gap-3">
                        <div className="avatar w-10 h-10 rounded-full">
                          <img src={msg.sender.profilePic} alt={msg.sender.fullName} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{msg.sender.fullName}</h3>
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" /> Just now
                          </p>
                        </div>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => markReadMutation(msg._id)}
                        >
                          Mark Read
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* NO NOTIFICATIONS */}
            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 &&
              unreadMessages.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
