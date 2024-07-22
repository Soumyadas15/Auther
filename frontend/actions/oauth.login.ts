export const oauthLogin = async (provider: 'google' | 'github' | 'facebook') => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login/${provider}`
}