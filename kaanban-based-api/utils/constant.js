export const CONSTANTS = {
    //Rputing constants
    PORT: 8081,
};


export const RESPONSE_CODES = {
    SUCCESS: 200,
    MISSING_DATA: 417,
    ERROR: 415,
    EXCEPTION: 402,
    FAILED: 401,
    NOT_FOUND: 404
}

export const MESSAGES = {
    
    WELCOME: "Welcome to Project Management.",

    //No route found
    NO_ROUT_FOUND: "Please check the url and type",
    NO_EXCEPTION_MESSAGE: "Some thgn went wrong",

    EMPTY_BODY: "No data",
    NO_TOKEN: "You are not authorized",
    EMPTY_FORM: "Form body is required",

    INVALID_TOKEN: "Invalid token. Please login again",
    ACCOUNT_NOT_FOUND: "Invalid token. Please register first",

    SEARCH_SUCCESS: "Searching successfull",
    CREATE_SUCCESS: "Created successfully",
    UPDATE_SUCESS: "Updated successfully",
    DATA_NOT_FOUND: "Data not found",
    DELETE_SUCCESS: "Deleted successfully",

    //signup
    SIGN_UP_FAILED: "Failed to register",
    SIGN_UP_SUCCESS: "Signed up successfully",

    SIGN_UP_EMPTY_BODY: "No data to Save.",
    SIGN_UP_EMPTY_USERNAME: "userName is required",
    SIGN_UP_EMPTY_PASSWORD: "password of min 6 digit is required",


    SIGN_UP_EMAIL_USED: "Another account is using this email",

    EMAIL_INVALID: "Please enter a valid email",

    EMPTY_EMAIL: "email is required",
    EMPTY_USERNAME: "Username is required",
    EMPTY_PHONE: "Mobile number is required",
    EMPTY_ADDRESS: "Address is required",
    EMPTY_PASSWORD: "Password is required",
    EMPTY_IMAGE: "Image is required",
    //Login
    LOGIN_SUCCESS: "Login successful",
    LOGIN_FAILED: "Invalid email and password",
    LOGIN_EMPTY_BODY: "Please enter you credentails.",


    LOGIN_EMAIL_INVALID: "Entered email is not valid",

    //logout
    LOGOUT_SUCCES: "Logout successully",

    //serach User
    SEARCH_FAILED: "No data matched",
    SEARCH_SUCCESS: "Searching successfull",

    //Update users
    USER_UPDATE_FAILED: "Failed to update user details",
    USER_IMAGE_UPDATE_FAILED: "Failed to upload profile photo",
    USER_UPDATE_SUCCESS: "Successfully update user details",

    USER_UPDATE_EMPTY_BODY: "No data to update",

    USER_CHANGE_PASS_EMPTY_PASSWORD: "Password can not be blank",
    USER_CHANGE_PASS_EMPTY_ID: "User id is required ",
    USER_SEARCH_SUCCESS: "User is search successfully",

    USER_NOT_FOUND: "User not found",

    //task
    TASK_SEARCH_SUCCESS: "task is search successfully",
    TASK_CHANGE_PASS_EMPTY_PASSWORD: "Password can not be blank",
    TASK_CHANGE_PASS_EMPTY_ID: "task id is required ",

    //column
    COLUMN_SEARCH_SUCCESS: "Column is search successfully",

    //Project
    PROJECT_SEARCH_SUCCESS: "Project is search successfully",

    //Password change
    FORGOT_PASSWORD_FAILED: "Failed to change passsword",
    FORGOT_PASSWORD_SUCESS: "Successfully updated password",
    FORGOT_PASSWORD_EMPTY_BODY: "Password is reuired to update",

    

    EMPTY_USER_ID: "User id is required",
    EMPTY_RATING: "Rating is required",

    EMPTY_CHECKIN: "Check in date and time is required",
    EMPTY_CHECKOUT: "Check out date and time is required",
    EMPTY_PRICE: "Price is required",

};

