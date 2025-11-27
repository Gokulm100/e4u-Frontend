  const styles = {
    app: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
            background: 'linear-gradient(90deg, #194983ff 0%, #276ec6ff 100%)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    headerContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '16px',
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ffffffff',
      cursor: 'pointer',
      margin: 0
    },
    nav: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center'
    },
    navButton: {
      background: 'none',
      border: 'none',
      color: '#ffffffff',
      cursor: 'pointer',
      fontSize: '16px',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    postButton: {
      backgroundColor: '#519aeeff',
      color: '#ffffff',
      border: 'none',
      padding: '10px 16px',
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.38)',
      borderRadius: '50px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer',
      fontSize: '16px'
    },
messageButton: {
      backgroundColor: 'transparent',
      color: '#ffffff',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    menuButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'none'
    },
    mobileMenu: {
      marginTop: '16px',
      paddingBottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    mobileMenuItem: {
      width: '100%',
      textAlign: 'left',
      padding: '12px 16px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '8px',
      fontSize: '16px',
      color:'black',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 16px'
    },
    searchBar: {
      borderRadius: '8px',
      marginBottom: '24px'
    },
    searchInputWrapper: {
      position: 'relative'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      color: '#9ca3af'
    },
    searchInput: {
      width: '100%',
      padding: '10px 10px 10px 40px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    categories: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      overflowX: 'auto',
      paddingBottom: '8px'
    },
    categoryButton: {
      padding: '10px 16px',
      borderRadius: '24px',
      border: '0px solid #5077b2ff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontSize: '15px',
      transition: 'all 0.2s'
    },
    categoryButtonActive: {
      backgroundColor: '#205da7ff',
      color: '#ffffff'
    },
    categoryButtonInactive: {
      backgroundColor: '#ffffff',
      color: '#374151'
    },
    subCategoryButton: {
      padding: '8px 18px',
      borderRadius: '20px',
      border: '0px solid #252628ff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      fontSize: '15px',
      transition: 'all 0.2s'
    },
    subCategoryButtonActive: {
      background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)',
      color: '#2563eb'
    },
    subCategoryButtonInactive: {
      background: 'linear-gradient(90deg, #f7f7f7 0%, #e0eafc 100%)',
      color: '#333'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s'
    },
    cardImageWrapper: {
      position: 'relative'
    },
    cardImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    favoriteButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      backgroundColor: '#ffffff',
      border: 'none',
      padding: '8px',
      borderRadius: '50%',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    cardContent: {
      padding: '16px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '4px',
      overflow: 'hidden',
      textAlign: 'left',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    cardCategory: {
      color: '#2563eb',
      fontWeight: 500,
      fontSize: 14,
      margin: '4px 0',
      textAlign: 'left'
    },
    cardPrice: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '15px'
    },
    cardLocation: {
      display: 'flex',
      alignItems: 'center',
      color: '#6b7280',
      fontSize: '14px',
      marginBottom: '4px',
      gap: '4px'
    },
    cardPosted: {
      color: '#9ca3af',
      fontSize: '12px'
    },
    detailContainer: {
      maxWidth: '1024px',
      margin: '0 auto',
      padding: '24px 16px'
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: '#2563eb',
      cursor: 'pointer',
      fontSize: '16px',
      borderRadius: '8px',
      
      fontWeight: '600',
      marginBottom: '16px',
      padding: '8px 0'
    },
    detailCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    createFirstAdButton: {
              marginTop: 16,
              background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
              color: '#fff',
              fontWeight: 600,
              border: 'none',
              borderRadius: 8,
              padding: '12px 32px',
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37,99,235,0.08)'
            },  
    detailImage: {
      width: '100%',
      height: '400px',
      objectFit: 'cover'
    },
    detailContent: {
      padding: '15px',
      paddingBottom:'70px'
    },
    detailHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    detailTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    detailPrice: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#2563eb'
    },
    detailSection: {
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 0',
      margin: '16px 0'
    },
    detailLocation: {
      display: 'flex',
      alignItems: 'center',
      color: '#374151',
      marginBottom: '8px',
      gap: '8px'
    },
    descriptionSection: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    sellerCard: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px'
    },
    sellerInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    sellerAvatar: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '12px'
    },
    sellerName: {
      fontWeight: '600',
      marginBottom: '4px'
    },
    contactButton: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600'
    },
    formContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '24px 16px'
    },
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px'
    },
    formTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
      minHeight: '100px',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    submitButton: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 0'
    },
    emptyText: {
      color: '#6b7280',
      fontSize: '18px'
    },
    favoriteIcon: {
      width: '20px',
      height: '20px'
    },
    favoriteIconActive: {
      fill: '#ef4444',
      color: '#ef4444'
    },
    favoriteIconInactive: {
      color: '#6b7280'
    },
      smartSearch:{
    background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(37, 99, 235))',
    color: '#ffffffff',
    border: 'none',
    padding: '10px 16px',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.38)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    fontSize: '16px'

  }
  };

  export default styles;
