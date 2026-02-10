import { InMemoryDataBase } from '../users/infrastructure/inMemoryDataBase';
import { JwtTokenService } from '../users/infrastructure/Api/security/JwtTokenService';
import { LoginUser } from '../users/application/use-cases/LoginUser';
import { RegisterUser } from '../users/application/use-cases/RegisterUser';

import { InMemoryMessageRepository } from '../../lib/messages/infrastructure/InMemoryMessageRepository';
import { ReceiveAndReplyMessage } from '../../lib/messages/application/use-cases/ReceiveAndReplyMessage';
import { TelegrafAdapter } from '../messages/infrastructure/TelegrafAdapter';
import { UpdateAutoResponse } from '../messages/application/use-cases/UpdateAutoResponse';

const messageRepo = new InMemoryMessageRepository();
const telegramAdapter = new TelegrafAdapter();
const receiveAndReplyUseCase = new ReceiveAndReplyMessage(telegramAdapter, messageRepo);
telegramAdapter.setReceiveUseCase(receiveAndReplyUseCase);

const updateConfigUseCase = new UpdateAutoResponse();

const UserRepository = new InMemoryDataBase();
const tokenService = new JwtTokenService();

export const ServiceContainer = {
    user: {
        register: new RegisterUser(UserRepository),
        login: new LoginUser(UserRepository, tokenService)
    },
    messages: {
        receiveUseCase: receiveAndReplyUseCase,
        updateConfig: updateConfigUseCase,
        repository: messageRepo
    }
}