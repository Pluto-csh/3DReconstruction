<template>
	<view style="display: flex; justify-content: center; align-items: center; height: 100vh;">
		<u-button type="primary" :plain="true" text="运行" shape="circle" style="width: 50px; height: 50px;"
			@click="clickRun()"></u-button>
		<u-button type="success" :plain="true" text="下载" shape="circle" style="width: 50px; height: 50px;"
			@click="clickDownload()"></u-button>
		<u-button type="error" :plain="true" text="查看" shape="circle" style="width: 50px; height: 50px;"
			@click="clickDisplay()"></u-button>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import config from "../../config"
import { getToken } from '@/utils/auth'
const baseUrl = config.baseUrl;
var jobId
var jobPath = ""

export default {
	onLoad(options) {
		jobId = options.id;
	},

	methods: {
		clickRun() {
			uni.request({
				url: `${baseUrl}/system/job/runJob`,
				method: 'POST',
				header: {
					"Authorization": 'Bearer ' + getToken(),
				},
				data: {
					jobId: jobId,
				},
				success: (res) => {
					if (res.data.code == 200) {
						this.$refs.uToast.show({
							position: "top",
							message: res.data.msg,
							type: 'success',
							duration: 5000,
						})

					} else {
						this.$refs.uToast.show({
							position: "top",
							message: res.data.msg,
							type: 'error',
							duration: 5000,
						})

					}
				}
			})

		},
		clickDownload() {
			console.log("download")
			uni.showLoading({
				title: '正在下载'
			});
			var url = `${baseUrl}/system/job/downloadPly?jobId=${jobId}`;
			let dtask = plus.downloader.createDownload(url, {
				filename: "_downloads/3DRebuild/" + jobId + ".ply" //利用保存路径，实现下载文件的重命名
			}, (d, status) => {
				console.log(status)
				console.log(d)
				//d为下载的文件对象
				if (status == 200) {
					console.log("success")
					uni.hideLoading();
					this.$refs.uToast.show({
						position: "top",
						type: 'success',
						message: '已保存:/3DRebuild/' + jobId + '.ply', //保存路径
						duration: 5000,
					});
					//下载成功,d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
					jobPath = plus.io.convertLocalFileSystemURL(d.filename);
					console.log(jobPath)
				} else {
					//下载失败
					console.log(status)
					uni.hideLoading();
					plus.downloader.clear(); //清除下载任务
					this.$refs.uToast.show({
						position: "top",
						type: 'error',
						message: "文件下载失败", //保存路径
						duration: 5000,
					});
				}
			})
			dtask.start();
		},

		clickDisplay() {
			var that = this;
		
			uni.getSavedFileInfo({
				filePath: `file://storage/emulated/0/Android/data/io.dcloud.HBuilder/downloads/3DRebuild/${jobId}.ply`, //仅做示例用，非真正的文件路径
				success: function (res) {
					that.$store.commit("change", jobId);
					uni.navigateTo({
						url: `/pages/operate/model` // 跳转到/operate/index.vue并传递文件id
					});
				},
				fail: function (res) {
					console.log(res);
					that.$refs.uToast.show({
						position: "top",
						message: "文件不存在",
						type: 'error',
						duration: 5000,
					})
				}
			});
		},
	}
}
</script>

