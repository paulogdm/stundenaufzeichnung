import Vue from "vue"

declare module "vue/types/vue" {
    interface Vue {
        $loaders: {
            add: (key: string) => void
            remove: (key: string) => void
            queue: string[]
            loading: boolean
        }
    }
}