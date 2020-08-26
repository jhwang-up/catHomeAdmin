
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商家名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.tel" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="停车信息">
        <el-input v-model="form.parking" />
      </el-form-item>
      <el-form-item label="wifi">
        <el-input v-model="form.wifi" />
      </el-form-item>
      <!-- 需要一个时间选择器，拿到的是拼接好的字串传给后台～～～～！！！！ -->
      <el-form-item label="营业时间">
        <el-time-select
          v-model="form.startTime"
          :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }"
          placeholder="开始时间"
        ></el-time-select>

        <el-time-select
          v-model="form.endTime"
          :picker-options="{
          start: '17:30',
          step: '00:15',
          end: '24:00'
        }"
          placeholder="结束时间"
        ></el-time-select>
      </el-form-item>

      <el-form-item label="经度">
        <el-input v-model="form.longitude" />
      </el-form-item>

      <el-form-item label="纬度">
        <el-input v-model="form.latitude" />
      </el-form-item>

      <!-- <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>-->

      <!-- <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>-->

      <el-form-item label="商家介绍">
        <el-input v-model="form.info" type="textarea" />
      </el-form-item>

      <el-form-item>
        <!-- 需要上传图片，input -->
        <input type="file" name id="uploadInput" @change="uploadAli($event)" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <!-- <el-button @click="onCancel">Cancel</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addCatStore } from "@/api/catStore";
let OSS = require("ali-oss");
// 名称，地理位置 经纬度 imgUrl
export default {
  name: "storeAdd",
  data() {
    return {
      form: {},
      startTime: "", // 营业时间
      endTime: "", // 营业时间
      storeName: "",
      imgUrl: "",
      address: "",
      coordinate: "",
      isLoading: false,
    };
  },
  methods: {
    onSubmit() {
      // 得看一遍valid 表单过滤
      // 这里加上接口，post 然后给上 还要一个接口去接收数据并塞进
      this.isLoading = true;
      addCatStore(this.form).then((response) => {
        // this.list = response.data.items;
        this.listLoading = false;
        this.$message({
          message: "新增商家成功",
          type: "success",
        });
        this.$router.push({ name: "catStoreList" });
      });

      console.log(`${JSON.stringify(this.form)}`);
    },
    uploadAli(e) {
      var client = new OSS({
        region: "oss-cn-beijing",
        //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
        accessKeyId: "LTAI4FmSatZwSJzwrmUonJ3x",
        accessKeySecret: "zpAPx2yLiMRUdlQnfXQMEYKbbx0yN0",
        bucket: "sabotdata",
      });

      const file = e.target.files[0];
      //文件格式限制
      var suffix = file.name.substr(file.name.lastIndexOf("."));
      console.info("suffix", suffix);
      //支持的文件格式
      var fileTypes =
        "视频格式:.mp4 .avi .rmvb " + "图片格式： .jpg .jpeg .gif .png ";
      if (fileTypes.indexOf(suffix) == -1) {
        alert("暂不支持该文件格式");
        return;
      }

      //文件大小限制
      if (file.size > 100 * 1000 * 1000) {
        alert("文件不得大于100M");
        return;
      }
      var obj = Date.parse(new Date()); // 这里是生成文件名
      var storeAs = "cathome/" + obj + suffix; //命名空间
      // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
      async function put() {
        try {
          //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
          let result = await client.put(storeAs, file);
          if (result.res.status === 200) {
            this.imgUrl = result.url;
            console.log(result);
          }
        } catch (e) {
          console.log(e);
        }
      }
      put();
    },
  },
};
</script>
<style lang='stylus' scoped></style>
