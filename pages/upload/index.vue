<template>
	<view>
		<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="200"
			:previewFullImage="true">
		</u-upload>

		<u-modal :show="show" :title="title" @confirm="confirm">
			<u--input placeholder="请输入您的任务ID" border="bottom" v-model="value" clearable shape="circle"></u--input>
		</u-modal>
	</view>
</template>

<script>
import config from '../../config'
const baseUrl = config.baseUrl;
import { getToken } from '@/utils/auth'
export default {
	data() {
		return {
			fileList1: [],
			show: false,
			value: '',
			onBeforeReadHook: true,
			title: '请输入本次任务ID',
		}
	},
	methods: {
		// 删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1)
		},
		// 新增图片
		async afterRead(event) {
			// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
			this.show = true;
			// 创建一个 Promise 对象，等待确认
			await new Promise((resolve) => {
				this.confirmCallback = resolve;
			});
			console.log(this.value)
			let lists = [].concat(event.file)
			let fileListLen = this[`fileList${event.name}`].length
			lists.map((item) => {
				this[`fileList${event.name}`].push({
					...item,
					status: 'uploading',
					message: '上传中'
				})
			})

			for (let i = 0; i < lists.length; i++) {
				const result = await this.uploadFilePromise(lists[i].url,this.value)
				let item = this[`fileList${event.name}`][fileListLen]
				this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
					status: 'success',
					message: '',
					url: result
				}))
				fileListLen++
			}
		},
		confirm() {
			this.show = false;
			// 调用 confirmCallback，以继续执行 afterRead 中的其余部分
			if (typeof this.confirmCallback === 'function') {
				this.confirmCallback();
			}
		},

		uploadFilePromise(url,jobId) {
			return new Promise((resolve, reject) => {
				let a = uni.uploadFile({
					url: `${baseUrl}/system/job/addPhoto`,
					filePath: url,
					name: 'multipartFiles',
					header: {
						"Authorization": 'Bearer ' + getToken(),
					},
					formData: {
						user: 'test',
						jobId:jobId
					},
					success: (res) => {

						setTimeout(() => {
							console.log(res)
							resolve(res.data.data)
						}, 1000)
					}
				});
			})
		},
	}

}
</script>

<style lang="scss">
.page {
	background-color: #f5f6f7;
}

.mine-container {
	width: 100%;
	height: 100%;


	.header-section {
		padding: 15px 15px 45px 15px;
		background-color: #3c96f3;
		color: white;

		.login-tip {
			font-size: 18px;
			margin-left: 10px;
		}

		.cu-avatar {
			border: 2px solid #eaeaea;

			.icon {
				font-size: 40px;
			}
		}

		.user-info {
			margin-left: 15px;

			.u_title {
				font-size: 18px;
				line-height: 30px;
			}
		}
	}

	.content-section {
		position: relative;
		top: -50px;

		.mine-actions {
			margin: 15px 15px;
			padding: 20px 0px;
			border-radius: 8px;
			background-color: white;

			.action-item {
				.icon {
					font-size: 28px;
				}

				.text {
					display: block;
					font-size: 13px;
					margin: 8px 0px;
				}
			}
		}
	}
}
</style>
