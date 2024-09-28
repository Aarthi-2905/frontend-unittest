import Layout from '../components/Layout';
import { sideimage } from '../assets';
import Header from '../components/Header';

const Home = () => {
    return (
        <>
            <Header />
            <Layout>
                <img src={sideimage} alt='product detail' width={570} height={530} className='object-contain' />
            </Layout>
        </>
    );
};

export default Home;
