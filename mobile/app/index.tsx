import { useEffect } from 'react'
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'

import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/libs/apis'


const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/7de6306d2f1991c9151a',
};

export default function App() {
  const router = useRouter()


  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '7de6306d2f1991c9151a',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })

    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      handleGithubOAuthCode(code)
    }
  }, [response]);



  return (
    <View className="px-8 py-10 flex-1 items-center">
      <View className='flex-1 items-center justify-center gap-6'>
        <NlwLogo />
        <View className='space-y-2'>
          <Text className='text-center font-body text-2xl leading-tight text-gray-50'>Sua cápsula do tempo</Text>
          <Text className='text-center font-title text-base leading-relaxed text-gray-100'>Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
            com o mundo
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => signInWithGithub()}
          className='rounded-full bg-green-500 px-5 py-2'>
          <Text className='font-alt text-sm uppercase text-black'>Cadastar lembrança</Text>
        </TouchableOpacity>
      </View>

      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>Feito com 💜 no NLW da Rocketseat</Text>

    </View>
  )
}
