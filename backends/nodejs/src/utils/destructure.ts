export const destructureGitHubUser = (user: any) => {
    const {
        id,
        emails: [{ value: email }],
        photos: [{ value: image }],
        _json: { name, type }
    } = user;

    return { id, email, name, image, type };
};



export const destructureGoogleUser = (user: any) => {
    const type = 'User';

    const {
        _json: { sub, email, name, picture,  }
    } = user;

    return { sub, email, name, picture, type };
};



export const destructureFacebookUser = (user: any) => {
    const type = 'User';

    const { id, 
            displayName, 
            email,
            photos: [{ value: image }],
    } = user;

    return { id, email, displayName, image, type };
};