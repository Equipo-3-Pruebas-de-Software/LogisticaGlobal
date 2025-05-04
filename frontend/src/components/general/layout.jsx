export const Layout = ({enlaces, main}) => {
  return (
    
    <div className="layout">
      <header className="header">
        <h1>LogisticaGlobal.com</h1>
      </header>
      <div className="content">
        <nav className="nav">
          {enlaces}
        </nav>
          <main>
          {main}
        </main>
      </div>
    </div>
    
  )
}

export default Layout

  