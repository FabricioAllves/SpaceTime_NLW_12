import { useState } from 'react'
import { View, Text, TouchableOpacity, Switch, TextInput, ScrollView, Image } from 'react-native'
import Icon from '@expo/vector-icons/Feather'

import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/libs/apis'


export default function NewMemory() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState('');

  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  async function openImagePicker() {
        // Aqui apenas aprimos a galeria e selecionamos
    try{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,  
        quality: 1,
      });
  
      if(result.assets[0]) {
        // Pegando a Uri da imagem
        setPreview(result.assets[0].uri)
        //console.log(result.assets[0].uri)
      }
    }catch(err) {
      // deu erro
    }

  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if(preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      coverUrl = uploadResponse.data.fileUrl

    }

    await api.post('/memories', {
      content,
      isPublic,
      coverUrl,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    router.push('/memories')
  }

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
          onPress={openImagePicker}
          activeOpacity={0.7}
          className='h-32 justify-center rounded-lg border border-dashed border-gray-500 bg-black/20'
        >
          {preview ? (
            <Image source={{uri: preview}} className='h-full w-full rounded-lg object-cover'/>
          ) : (
            <View className='flex-row items-center justify-center gap-2'>
            <Icon name='image' color="#fff" />
            <Text className='font-body text-sm text-gray-300'>
              Adicionar foto ou video de capa
            </Text>
          </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical='top'
          className='p-0 font-body text-lg text-gray-50'
          placeholderTextColor="#56565a"
          placeholder='Fique livre para adicionar fotos, videos e relatos sobre experiência que você quer lembrar par sempre'
        />

        <TouchableOpacity
        onPress={handleCreateMemory}
          activeOpacity={0.7}
          className='rounded-full items-center self-end bg-green-500 mt-6 px-5 py-2'>
          <Text className='font-alt text-sm uppercase text-black'>Salvar</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}