export interface ILoginResponse {
    user: {
        email: string;
        name: string;
        role: string;
        image: string;
    };
    token: string;
}