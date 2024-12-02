import { query } from './constants.js';

//#####################################################################\\
//####################  VARIABLE DECLARATION  #########################\\
//#####################################################################\\
const graphqlEndpoint = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';
const signinEndpoint = 'https://zone01normandie.org/api/auth/signin';
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const loginButton = document.getElementById('Login-button');
const barChartButton = document.getElementById('barChartButton');
const circularButton = document.getElementById('circularButton');
const loginContainer = document.getElementsByClassName('login-container')[0];
const usernameDisplay = document.getElementById('username-display');
const statisticsDisplay = document.getElementById('statistics-display');
const emailAdd = localStorage.getItem('email');
export let token = ""

//#####################################################################\\
//####################  LOGOUT BUTTON PART  ###########################\\
//#####################################################################\\
logoutButton.addEventListener('click', async () => {
  try {
    loginContainer.style.display = 'block';
    usernameDisplay.textContent = '';
    statisticsDisplay.innerHTML = '';
    document.getElementById('circular-diagram-container').style.display="none"
    document.getElementById('bar-chart-container').style.display="none"
    alert('Logout successful');
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
});

//#####################################################################\\
//####################  CHAIN REQUEST PART ############################\\
//#####################################################################\\
const chainRequests = async (event) => {
  var username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  event.preventDefault();
  try {
    const auth = username; 
    const response = await fetch(signinEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    });


    if (response.ok) {
      const data = await response.json();
      token = data; // Assurez-vous que 'token' correspond au champ retourné
      // if (!token || token.split('.').length !== 3) {
      //   throw new Error('Invalid JWT format');
      // }

      // localStorage.setItem('jwt', token);
      console.log('Token saved:', token);

      // Mettre à jour l'interface utilisateur
      loginContainer.style.display = 'none';
      barChartButton.style.display = 'block';
      circularButton.style.display = 'block';

      // Récupérer les données utilisateur
      const userData = await getLogData(query);
      console.log('User data:', userData);

      if (userData == "data is empty") {
        return
      }

      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(auth)) {
        username = userData.user[0].firstName;
      }
      actualUser = userData.user[0].firstName;
      var actualUser = username
      usernameDisplay.textContent = `Welcome, ${actualUser}!`;

      displayStatistics();
    } else {
      const errorText = await response.text();
      console.error('Login error:', errorText);
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during chain requests:', error.message);
  }
};
//#####################################################################\\
//####################  GET DATA PART  ################################\\
//#####################################################################\\
 async function getLogData(query) {
  console.log(token);
  
  if (token === "") {
    return "data is empty"
  }
  
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response}`);
  } 
  const data = await response.json();
  console.log(data);
  
    if (data.errors) {
      throw new Error('GraphQL error:',data);
    }
  return data.data;
};

//#####################################################################\\
//####################  DISPLAY STATISTICS PART #######################\\
//#####################################################################\\
async function displayStatistics() {
  const statsElement = document.getElementById('statistics-display');
  const data = await getLogData(query);
  if (data === "data is empty") {
    return
  }
  var total =0;
  const user  = data.user[0];
  const path = "";
  console.log('User:', user);
  const xpsData = user && user.xps;
  console.log('xpsData:', xpsData);

  if (xpsData) {
     xpsData.filter(xps => {
      return xps.path.startsWith("/rouen/div-01/") 
        // && !xps.path.startsWith("/rouen/div-01/checkpoint/") 
        && !xps.path.startsWith("/rouen/div-01/piscine-js/")
        && !xps.path.startsWith("/rouen/div-01/piscine-go/");
    }).map((xps) => {
      console.log(xps.path);
      
      total += xps.amount;
    });
  } else {
    console.log('No XPS data found');
  }
  statsElement.innerHTML = `
    <h2>User Data</h2>
    <h2>Statistics</h2>
    <p>User ID: ${data.user[0].id}</p>
    <p>First Name: ${data.user[0].firstName}</p>
    <p>Last Name: ${data.user[0].lastName}</p>
    <p>Login: ${data.user[0].login}</p>
    <p>Github ID: ${data.user[0].githubId}</p>
    <h2> ${data.user[0].login}'s expreriences</h2>
    <p> experiences amount : ${total} </p>
    <p>Given experiences: ${data.user[0].totalUp} xps</p>
    <p>Earned experiences: ${data.user[0].totalDown} xps</p>
    <p>Audit Ratio: ${data.user[0].auditRatio.toFixed(2)}</p>
  `;
  barChartButton.style.display = 'block';
  circularButton.style.display = 'block';
}

loginButton.addEventListener('click', chainRequests);

export { getLogData };
