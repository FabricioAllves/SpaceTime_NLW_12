import { useState } from 'react'
import { View, Text, TouchableOpacity, Switch, TextInput, ScrollView } from 'react-native'
import Icon from '@expo/vector-icons/Feather'

import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function NewMemory() {
  const [isPublic, setIsPublic] = useState(false);

  const { bottom, top } = useSafeAreaInsets()

  return (
    <ScrollView className='flex-1 px-8'
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className='flex-row mt-4 items-center justify-between'>
        <NlwLogo />
        <Link href="/memories" asChild>
          <TouchableOpacity className='h-10 w-10 items-center justify-center rounded-full bg-purple-500'>
            <Icon name='arrow-left' size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className='mt-6 space-y-6'>
        <View className='flex-row items-center gap-2'>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#767577', true: '#372560' }}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
          />
          <Text className='font-body text-base text-gray-200'>
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className='h-32 justify-center rounded-lg border border-dashed border-gray-500 bg-black/20'
        >
          <View className='flex-row items-center justify-center gap-2'>
            <Icon name='image' color="#fff" />
            <Text className='font-body text-sm text-gray-300'>
              Adicionar foto ou video de capa
            </Text>
          </View>
        </TouchableOpacity>

        <TextInput
          multiline
          className='p-0 font-body text-lg text-gray-50'
          placeholderTextColor="#56565a"
          placeholder='Fique livre para adicionar fotos, videos e relatos sobre experiência que você quer lembrar par sempre'
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full items-center self-end bg-green-500 mt-6 px-5 py-2'>
          <Text className='font-alt text-sm uppercase text-black'>Salvar</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}