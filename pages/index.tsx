import type {NextPage} from 'next';
import {useGlobalContext} from '../src/contexts/global-context/useGlobalContext';

const Index: NextPage = () => {
  const {windowManager} = useGlobalContext();
  return windowManager.render();
};

export default Index;
