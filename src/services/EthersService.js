import { ethers } from 'ethers'
import DragonKittyABI from '../assets/data/ethereum/DragonKittyABI.json'

// const provider = ethers.getDefaultProvider('rinkeby')
const provider = new ethers.providers.JsonRpcProvider('https://shared-geth-rinkeby.nodes.deploy.radar.tech/?apikey=8f814d34c32fe7c41c2e908a8a2f210531fe0573685304a1');
// const provider = new ethers.providers.JsonRpcProvider('https://shared-parity-mainnet.nodes.deploy.radar.tech/?apikey=7d9c7347814ae1a0630063de2a5df8f8d9be7d6a487dc7ad');


export default class EthersService {
  constructor (provider = null, store, options = { dev: false }) {
    this.store = store
    this.provider = provider
    this.options = options
    this.web3 = {}
    this.defaultAccount = ''
  }

  async eventListener () {
    console.log('listening...')
    const contract = new ethers.Contract('0x715345953F69b960557F7E61A2d99E0324261134', DragonKittyABI, provider)

    contract.on('BossAppears', (oldValue, newValue, event) => {
      console.log('old and new', oldValue, newValue)
      console.log('BOSS APPEARS: ', event)
    })

    contract.on('BossDefeated', (oldValue, newValue, event) => {
      console.log('old and new', oldValue, newValue)
      console.log('BOSS DEFEATED: ', event)
    })

    contract.on('DamageInflicted', (oldValue, newValue, event) => {
      console.log('old and new', oldValue, newValue)
      console.log('DAMAGE INFLICTED: ', event)
    })

    const boss = await contract.currentBoss()
    console.log('boss: ', boss)
  }
}
