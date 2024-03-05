import { AtModal, AtModalHeader, AtModalContent} from 'taro-ui'
import {View} from '@tarojs/components'
import {useState} from 'react'
import {UploadPic} from './uploadPic'

export default function EditCate ({isAddModal, setIsAddModal}) {
  const [pics, setPics] = useState([]);

  return (
    <View>
      <AtModal isOpened={isAddModal}>
        <AtModalHeader>编辑分类</AtModalHeader>
        <AtModalContent>
          <UploadPic
            maxNumber={3}
            fileList={pics}
            interfaceName='categories'
            fileChange={(e) => {
              console.log('e', e)
              setPics(e)
            }}
            setIsModalOpen={setIsAddModal}
          />  
        </AtModalContent>
      </AtModal>
    </View>
  )
}