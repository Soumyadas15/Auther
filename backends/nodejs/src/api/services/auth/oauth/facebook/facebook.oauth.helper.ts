import { JwtService } from "../../jwt/jwt.service";
import { UserRepository } from "../../user/user.repository";
import { ILoginResponse } from "../../user/ILoginResponse";
import { destructureFacebookUser } from "../../../../../utils/destructure";
import { AppError } from "../../user/AppError";


export class FacebookOauthHelper {
    private userRepository: UserRepository;
    private jwtService: JwtService;

    constructor(userRepository: UserRepository, jwtService: JwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    async handleFacebookLogin(profile: any, accessToken: string): Promise<ILoginResponse | null> {
        const { id, email, displayName, image, type } = destructureFacebookUser(profile);

        if(!email){
            throw new AppError("Failed to fetch email, try a different provider");
        }

        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            if (existingUser.provider !== 'facebook') {
                throw new AppError("Email already in use with a different provider");
            }

            const token = this.jwtService.generateToken(existingUser.id);

            return {
                user: {
                    email: existingUser.email,
                    name: existingUser.name,
                    role: existingUser.role,
                    image: existingUser.image,
                },
                token: token,
            };
        }

        const newUser = await prisma.user.create({
            data: {
                name: displayName,
                email: email,
                image: image,
                provider: 'facebook',
                emailVerified: new Date(Date.now()),
                isTwoFactorEnabled: false,
            }
        })

        const account = await prisma.account.create({
            data: {
                provider: 'facebook',
                providerAccountId: id,
                type: type,
                access_token: accessToken,
                userId: newUser.id
            }
        })

        const token = this.jwtService.generateToken(newUser.id);

        return {
            user: {
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image,
            },
            token: token,
        };
    }
}
