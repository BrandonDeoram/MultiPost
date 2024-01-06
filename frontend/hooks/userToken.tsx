// import { useEffect, useState } from "react";
// import { useAuth, useClerk } from "@clerk/nextjs";

// export const useUserToken = () => {
//   const { userId, getToken } = useAuth();
//   const { user } = useClerk();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [token, setToken] = useState<string | null>(null);
//   const [email, setEmail] = useState<string | null>(null);


//   useEffect(() => {
//     const fetchData = async () => {
//       if (userId && user) {
//         const token = await getToken();
//         const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId);
//         setToken(token);
//         setEmail(primaryEmail?.emailAddress ?? null);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId, user]);

//   return { loading, token,userId,email };
// };
