import { StatusBar } from 'expo-status-bar'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session'

import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from './src/assets/bg-blur.png'
import Stripes from './src/assets/stripes.svg'
import NlwLogo from './src/assets/nlw-spacetime-logo.svg'
import { styled } from 'nativewind'
import { useEffect } from 'react'
import { api } from './src/libs/apis'

const StyledStripes = styled(Stripes)

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/7de6306d2f1991c9151a',
};

export default function App() {
  const [loadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold
  })

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

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      
      api.post('/register', {
        code,
      }).then((response) => {
        const {token} = response.data

        console.log(token)
      })
    }
  }, [response]);

  if (!loadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={blurBg}
      className="bg-gray-900 px-8 py-10 flex-1 items-center relative"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className='absolute left-2'/>

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

      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
