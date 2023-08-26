import { useParams } from 'react-router-dom';
import Layout from './Layout';
import GroupIdContainer from '../containers/groupId';

const GroupIdPage = () => {
  const { groupId } = useParams();

  return (
    <Layout>
      <GroupIdContainer id={groupId} />
    </Layout>
  );
};

export default GroupIdPage;
