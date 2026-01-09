import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 70px)',
      padding: '40px 20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ 
        fontSize: '120px', 
        fontWeight: 'bold', 
        color: '#007bff',
        margin: '0 0 20px 0',
        lineHeight: '1'
      }}>
        404
      </h1>
      <h2 style={{ 
        fontSize: '32px', 
        color: '#333',
        margin: '0 0 20px 0'
      }}>
        {t('notFound.subtitle')}
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: '#666',
        maxWidth: '600px',
        margin: '0 0 40px 0',
        lineHeight: '1.6'
      }}>
        {t('notFound.detailed')}
      </p>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link 
          to="/"
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0069d9';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {t('notFound.toMain')}
        </Link>
        <Link 
          to="/login"
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5a6268';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6c757d';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {t('notFound.toLogin')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
