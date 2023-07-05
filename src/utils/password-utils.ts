import { createHash } from "node:crypto";


 const passwordUtils  = {
    encrypt(hash: string) :string{
        return createHash('sha256').update(hash).digest('hex')
    },
    passwordIsMatch(encripted: string, decrypted: string) :boolean{
        return (this.encrypt(decrypted) === encripted)
    }
}
export default passwordUtils;