import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userSerivce } from "@/services/userService";
import { useEffect } from "react";

export const useCurrentUser = () => {
    const token = useAuthStore((state) => state.token);
    const setCurrentUser = useUserStore((state) => state.setCurrentUser);

    const query = useQuery({
        queryKey: ['currentUser', token],
        queryFn: () => userSerivce.getCurrentUser(token!),
        enabled: !!token,   
        staleTime: 1000 * 60 * 5,
        
        
    })

    // sync user state with store
    useEffect(() => {
        if (query.data) {
            setCurrentUser(query.data);
        }
    }, [query.data, setCurrentUser]); 
    
    return query;
};

export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => userSerivce.getUsers(),
        staleTime: 1000 * 60 * 5,
    })
};

export const useCreateUser = () => {
    return useMutation({
        mutationFn: userSerivce.createUser,
        onSuccess: (user) => {
            const setCurrentUser = useUserStore((state) => state.setCurrentUser);
            setCurrentUser(user);
        }
    })
}