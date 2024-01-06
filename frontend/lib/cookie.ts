// utils/cookies.ts
import Cookies from 'js-cookie';

const COOKIE_NAME = 'userIds';

export const addUserToCookieList = (userId: string) => {
    // Retrieve the existing list from the cookie
    const userList = getUserListFromCookie();
  
    // Add the new user ID to the list if it's not already present
    if (!userList.includes(userId)) {
      // Merge the new user ID with the existing list
      const updatedList = [...userList, userId];
      Cookies.set(COOKIE_NAME, JSON.stringify(updatedList), { expires: 365 });
    }
  };

export const removeUserFromCookieList = (userId: string) => {
  // Retrieve the existing list from the cookie
  const userList = getUserListFromCookie();

  // Remove the specified user ID from the list
  const updatedList = userList.filter((id: string) => id !== userId);

  // Save the updated list to the cookie
  Cookies.set(COOKIE_NAME, JSON.stringify(updatedList), { expires: 365 });
};

export const getUserListFromCookie = () => {
  // Retrieve the user list from the cookie and parse it as JSON
  const userListString = Cookies.get(COOKIE_NAME) || '[]';
  return JSON.parse(userListString);
};

export const removeAllUsersFromCookieList = () => {
  // Remove all user IDs from the list by setting an empty array
  Cookies.set(COOKIE_NAME, '[]', { expires: 365 });
};
