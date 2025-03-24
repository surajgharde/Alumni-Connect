import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import store from '../store/store';
import '../styles/globals.css';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';
import AuthGuard from '../components/Auth/AuthGuard';

function MyApp({ Component, pageProps }: AppProps) {
  // Properly extract session from pageProps
  const { session, ...restPageProps } = pageProps;

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-8">
            <AuthGuard>
              <Component {...restPageProps} />
            </AuthGuard>
          </main>
          <Footer />
        </div>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;