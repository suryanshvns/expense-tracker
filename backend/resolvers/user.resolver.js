import { users } from "../dummy-data/data.js"

const userResolver = {
    Query:{
        users: () => {
            return users
        },
        user: (_, {userId}) => {
            return users.find((user) => user._id === userId)
        }
    },
    Mutation: {}
}

export default userResolver;