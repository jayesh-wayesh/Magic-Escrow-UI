//import NonFungibleToken,Dappymon from 0x01cf0e2f2f715450
import NonFungibleToken,Dappymon from 0x01

pub fun main(): [[UInt64]] {
    //0x02
    //0x179b6b1cb6755e31
    let ref = getAccount(0x02)
                      .getCapability(/public/NFTReceiver)!
                      .borrow<&{Dappymon.CollectionPublic,NonFungibleToken.CollectionPublic} >()!
          
    let x = ref.getIDs()
    var y:[UInt64] = []

    let len = x.length
    var index = 0
    while index < len {
       
        log(x[index])
        log(ref.borrowDappymon(id: x[index]).ethTokenId)
        y.append(ref.borrowDappymon(id: x[index]).ethTokenId)
        index = index + 1
    }

    let z:[[UInt64]] = []
    z.append(x)
    z.append(y)
    
    return z
}