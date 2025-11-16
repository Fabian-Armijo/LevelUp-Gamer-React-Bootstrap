import api from './api';

const BASE_URL = 'http://localhost:8081/api/rewards';

class RewardsService {
    
    // Llama a: POST /api/rewards/redeem
    redeemReward(productId) {
        return api.post(`${BASE_URL}/redeem`, { productId });
    }
}

export default new RewardsService();