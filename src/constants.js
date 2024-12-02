export const query = `query {
    user (order_by:{ login : asc}) {
      id
      firstName
      lastName
      login
      githubId
      totalUp
      totalDown
      auditRatio
      xps {
        amount
        originEventId
        path
        userId
      }
    }
    audit {
      auditorLogin
    }
  }`;
  