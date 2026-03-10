<template>
  <!--
   action 图片上传的地址
   show-file-list	是否显示已上传文件列表
   on-success	文件上传成功时的钩子
   before-upload 上传文件之前需要触发的函数
   http-request	覆盖默认的上传行为，可以自定义上传的实现
   -->
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadAvatar"
  >
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      // 需要在上传头像之前对图片进行校验
      // 1.限制上传文件必须为图片格式 jpg jpeg png gif bmp
      const typeArr = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif']
      const isJPG = typeArr.includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5 // 小于5M

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG,JPEG,PNG,BMP,GIF 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt5M // 上传前的数据校验 满足就返回true  不满足条件就返回false那就不上传文件
    },
    uploadAvatar(val) {
      console.log(val)
      // 上传头像
      // 准备cos链接对象
      const cos = new COS({
        SecretId: process.env.VUE_APP_COS_SECRET_ID,
        SecretKey: process.env.VUE_APP_COS_SECRET_KEY
      })
      // 开始上传头像
      cos.uploadFile({
        Bucket: 'renliziyuan-1257863609', /* 存储桶的名字*/
        Region: 'ap-guangzhou', /* 存储桶所在地域，必须字段 */
        Key: val.file.name, /* 上传后图片显示的名字*/
        Body: val.file, // 上传文件对象
        SliceSize: 1024 * 1024 * 5 /* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
      }, (err, data) => {
        if (data.statusCode === 200 && data.Location) {
          this.$emit('input', 'https://' + data.Location)
        } else {
          this.$message.error('上传头像失败')
          console.log(err) // 处理一下error
        }
      })
    }
  }
}

</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
