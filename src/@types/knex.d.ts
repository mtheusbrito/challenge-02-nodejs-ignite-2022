import {Knex} from 'knex'

declare module 'knex/types/tables'{
    export interface Tables {
        users: {
            id: string
            name: string
            username: string
            password: string

        },
        snakcs: {
            id: string
            name: string
            description: string 
            diet:boolean
            created_at: string
            user_id: string
        }
        
    }
}