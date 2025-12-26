import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { accountService } from "@/services/accountService";

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export const useGetUsers = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ["users", pageNumber, pageSize],
    queryFn: () => userService.getPaginatedUsers(pageNumber, pageSize),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetUserByAccountId = (accountId?: string) => {
  return useQuery({
    queryKey: ["user", accountId],
    queryFn: () => {
      if (!accountId) throw new Error("Account ID required");
      return accountService.getUserByAccountId(accountId);
    },
    enabled: !!accountId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.RemoveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      userService.updateUser(id, data),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user", variables.id],
      });
    },
  });
};
