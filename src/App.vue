<template>
  <div>
    <div v-if="!isLoading">
      <form action="#">
        <label for="profile">نام:</label>
        <input type="text" value="nima" v-model="info.username" />
        <label for="profile">نام خانوادگی:</label>
        <input type="text" value="nima" v-model="info.lname" />
        <label for="profile">شماره تلفن:</label>
        <input type="text" value="nima" v-model="info.phone" />
      </form>
      <br />
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="نام"
        >
          <a-input
            v-decorator="[
              'username',
              { rules: [{ required: true, message: 'نام خود را وارد کنید' }] },
            ]"
            placeholder="نام"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="نام خانوادگی"
        >
          <a-input
            v-decorator="[
              'lname',
              {
                rules: [
                  { required: true, message: 'نام خانوادگی خود را وارد کنید' },
                ],
              },
            ]"
            placeholder="نام خانوادگی "
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="ایمیل">
          <a-input
            v-decorator="[
              'email',
              {
                rules: [
                  {
                    type: 'email',
                    message: 'ایمیل وارد شده معتبر نمی باشد',
                  },
                  {
                    required: true,
                    message: 'ایمیل خود را وارد کنید',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="رمز" has-feedback>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: 'رمز خود را وارد کنید',
                  },
                  {
                    validator: validateToNextPassword,
                  },
                ],
              },
            ]"
            type="password"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="تکرار رمز عبور" has-feedback>
          <a-input
            v-decorator="[
              'confirm',
              {
                rules: [
                  {
                    required: true,
                    message: 'رمز خود را مجددا وارد کنید',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              },
            ]"
            type="password"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="شماره تلفن">
          <a-input
            v-decorator="[
              'phone',
              {
                rules: [
                  { required: true, message: 'شماره تلفن خود را وارد کنید' },
                ],    
              },
            ]"
            style="width: 100%"
          >
            <a-select
              slot="addonBefore"
              v-decorator="['prefix', { initialValue: '98' }]"
              style="width: 70px"
            >
              <a-select-option value="86">+98</a-select-option>
              <a-select-option value="87">+87</a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item v-bind="tailFormItemLayout">
          <a-checkbox v-decorator="['agreement', { valuePropName: 'checked' }]">
            تایید شرایط و
            <a href>قوانین سایت</a>
          </a-checkbox>
        </a-form-item>
        <a-form-item v-bind="tailFormItemLayout">
          <a-button type="primary" html-type="submit">ثبت نام</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div v-else>
      <a-modal v-model="modal2Visible" centered :footer="null" width="95px" :closable="false">
        <a-spin size="large" />
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      info: {
        username: "",
        lname: "",
        phone: ""
      },
      modal2Visible: false,
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 16 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 16 },
          sm: { span: 8 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 16,
            offset: 0
          },
          sm: {
            span: 8,
            offset: 8
          }
        }
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    openNotificationWithIcon(success) {
      this.$notification[success]({
        message: "ثبت نام با موفقیت انجام شد"
      });
    },
    // openNotification(placement) {
    //   this.$notification.open({
    //     message: `Notification ${placement}`,
    //     description: "ثبت نام با موفقیت انجام شد",
    //     placement,
    //   });
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.modal2Visible = true;
          this.$store.dispatch("LOAD_INFO", values);
          setTimeout(() => {
            this.openNotificationWithIcon("success");
            //console.log("this is user info log",userinfo);
          }, 3000);
          this.info.username = values.username;
          this.info.lname = values.lname;
          this.info.phone = values.phone;
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("رمز ها شباهت ندارند");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    }
  },
  computed: {
    ...mapGetters(["IS_LOADING"]),
    ...mapState(["isLoading", "userInfo"])
  }
};
</script>

<style scoped>
</style>
