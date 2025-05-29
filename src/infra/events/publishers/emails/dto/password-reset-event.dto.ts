import { MessagingTopics } from '@/infra/events/enum';

export class PasswordResetEventDto {
  topic_name: MessagingTopics.EMAIL_PASSWORD_RESET;
  first_name: string;
  email: string;
  reset_token: string;
}
