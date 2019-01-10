declare namespace NodeJS {
    export interface Global {
        $nuxt: any
    }
    interface Process {
        browser: boolean
        client: boolean
        server: boolean
    }
}