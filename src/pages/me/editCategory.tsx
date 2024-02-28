import Taro from '@tarojs/taro'
import {AtForm, AtInput, AtButton, AtList, AtListItem, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtImagePicker} from 'taro-ui'
import {View, Text} from '@tarojs/components'
import {useState} from 'react'
import {UploadPic} from './uploadPic'

export default function EditCate ({isModalOpen, setIsModalOpen}) {
  const [form, setForm] = useState({
    name:'',
  })
  const [pics, setPics] = useState([]);

  const handleInputChange = (value, name) => {
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleInputSubmit = () => {
    setIsModalOpen(false);
  }

  return (
    <View>
      <AtModal isOpened={isModalOpen}>
        <AtModalHeader>编辑分类</AtModalHeader>
        <AtModalContent>
          <AtForm>
            <AtInput name='name'
            title='分类名称'
            type='text'
            placeholder='请输入分类名称'
            value={form.name}
            onChange={(value) => handleInputChange(value, 'name')}>
            </AtInput>
          <UploadPic
            maxNumber={3}
            fileList={pics}
            interfaceName='categories'
            fileChange={(e) => {
              console.log('e', e)
              setPics(e)
            }}
          />  
          </AtForm>
          
        </AtModalContent>
        <AtModalAction>
          <AtButton onClick={() => setIsModalOpen(false)}>取消</AtButton>
          <AtButton onClick={handleInputSubmit}>提交</AtButton>
        </AtModalAction>
      </AtModal>
    </View>
  )
}