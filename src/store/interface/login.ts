export interface IToken {
    accessToken: string
    tokenType: string
    expiresAt: number
}

export interface ILoginState {
    token: IToken
}