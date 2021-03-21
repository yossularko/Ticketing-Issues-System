import React, {useEffect, useMemo, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Router from './router';
import RootRouter from './router/RootRouter';
import {AuthContext} from './components/AuthContext';

const App = () => {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(
    () => ({
      signIn: async (userName, password) => {
        // setUserToken('jadhajd'),
        // setIsLoading(false)
        let userToken;
        userToken = null;
        if (userName == 'user' && password == 'pass') {
          try {
            userToken = 'jadhajd';
            await AsyncStorage.setItem('userToken', userToken);
          } catch (err) {
            console.log(err);
          }
        }
        console.log('user token: ', userToken);
        dispatch({type: 'LOGIN', id: userName, token: userToken});
      },
      signOut: async () => {
        // setUserToken(null),
        // setIsLoading(false)
        try {
          await AsyncStorage.removeItem('userToken');
        } catch (err) {
          console.log(err);
        }
        dispatch({type: 'LOGOUT'});
      },
      signUp: () => {
        // setUserToken('jadhajd'),
        // setIsLoading(false)
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false)
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (err) {
        console.log(err);
      }
      console.log('user token: ', userToken);
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
      {loginState.userToken !== null ? (
        <Router /> )
      :  <RootRouter /> 
      }
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
