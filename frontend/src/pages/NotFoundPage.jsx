import { Link } from 'react-router-dom';

const NotFoundPage = () => {
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
        Страница не найдена
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: '#666',
        maxWidth: '600px',
        margin: '0 0 40px 0',
        lineHeight: '1.6'
      }}>
        Извините, запрашиваемая страница не существует или была перемещена.
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
          На главную
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
          Войти в аккаунт
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
