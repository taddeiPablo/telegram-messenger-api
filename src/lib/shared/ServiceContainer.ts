// Users
import { InMemoryDataBase } from '../users/infrastructure/inMemoryDataBase';
import { JwtTokenService } from '../users/infrastructure/Api/security/JwtTokenService';
import { LoginUser } from '../users/application/use-cases/LoginUser';
import { RegisterUser } from '../users/application/use-cases/RegisterUser';
// Messages
import { InMemoryMessageRepository } from '../../lib/messages/infrastructure/InMemoryMessageRepository';
import { ReceiveAndReplyMessage } from '../../lib/messages/application/use-cases/ReceiveAndReplyMessage';
import { TelegrafAdapter } from '../messages/infrastructure/TelegrafAdapter';
import { UpdateAutoResponse } from '../messages/application/use-cases/UpdateAutoResponse';
import { SendMessageToUser } from '../messages/application/use-cases/SendMessageToUser';

// Messages
const messageRepo = new InMemoryMessageRepository();
const telegramAdapter = new TelegrafAdapter();
const receiveAndReplyUseCase = new ReceiveAndReplyMessage(telegramAdapter, messageRepo);
telegramAdapter.setReceiveUseCase(receiveAndReplyUseCase);
const sendMessageUseCase = new SendMessageToUser(telegramAdapter, messageRepo);
const updateConfigUseCase = new UpdateAutoResponse();
// Users
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
        sendMessage: sendMessageUseCase,
        repository: messageRepo
    }
}