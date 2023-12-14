export const errors = {
    no_email: {
        status: 404,
        message: "Email is required.",
    },
    email_validation_failure: {
        status: 404,
        message: "The given string is not an email.",
    },
    number_validation_failure: {
        status: 404,
        message: "The given string is not a number.",
    },
    internal_error: {
        status: 500,
        message: "Unexpected server error.",
    },
};
