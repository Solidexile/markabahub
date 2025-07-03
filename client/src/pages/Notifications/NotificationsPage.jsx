import { Container } from '@mui/material';
import NotificationList from '../../components/Notifications/NotificationList';

const NotificationsPage = () => {
  return (
    <Container maxWidth="md">
      <NotificationList />
    </Container>
  );
};

export default NotificationsPage;