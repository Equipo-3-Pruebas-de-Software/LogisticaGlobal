export const Tables = ({header, main}) => {
    return (
      <table>
        <thead className="header-table">
            <tr>
                {header}
            </tr>
        </thead>
        <tbody className="content-table">
            {main}
        </tbody>
      </table>
      
    )
  }
  
  export default Tables
  