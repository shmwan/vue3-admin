<template>
  <el-dialog
    class="DiyDialog"
    v-model="dialogVisible"
    :title="datas.title"
    width="33%"
    draggable
    :close-on-click-modal="false"
    :before-close="handleCancel"
  >
    <el-tabs
      v-model="datas.activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane :label="$t('lang.baseData.baseInfo')" name="first">
        <el-form
          :model="datas.submitForm"
          label-width="100px"
          label-position="left"
        >
          <el-col :span="22">
            <el-form-item :label="$t('lang.baseData.WLname')">
              <el-input
                v-model="datas.submitForm.matterName"
                :placeholder="$t('lang.baseData.plzWLname')"
                :disabled="datas.submitForm.id"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item :label="$t('lang.baseData.WLCode')">
              <el-input
                v-model="datas.submitForm.matterCode"
                :placeholder="$t('lang.baseData.plzWLcode')"
                :disabled="datas.submitForm.id"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item :label="$t('lang.baseData.GGms')">
              <el-input
                v-model="datas.submitForm.matterDescribe"
                :placeholder="$t('lang.baseData.plzGGms')"
                :disabled="datas.submitForm.id"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item :label="$t('lang.baseData.WLCompany')">
              <el-input
                v-model="datas.submitForm.matterUnit"
                :placeholder="$t('lang.baseData.plzWLCompany')"
                :disabled="datas.submitForm.id"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item :label="$t('lang.baseData.WLtype')">
              <el-select
                v-model="datas.submitForm.matterType"
                class="m-2"
                :placeholder="$t('lang.baseData.plzWLtype')"
                :disabled="datas.submitForm.id"
              >
                <el-option
                  v-for="(item, i) in datas.codeList1"
                  :key="i"
                  :label="item.dictionName"
                  :value="item.dictionCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item :label="$t('lang.baseData.CPtype')">
              <!-- <el-select
                v-model="datas.submitForm.productClassification"
                class="m-2"
                :placeholder="$t('lang.baseData.plzCPtype')"
                :disabled="datas.submitForm.id"
              >
                <el-option
                  v-for="(item, i) in datas.codeList3"
                  :key="i"
                  :label="item.dictionName"
                  :value="item.dictionCode"
                />
              </el-select> -->
              <el-input
                v-model="datas.submitForm.productClassificationStr"
                :placeholder="$t('lang.baseData.plzCPtype')"
                :disabled="datas.submitForm.id"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('lang.baseData.GGhePC')" name="second">
        <el-form
          :model="datas.submitForm"
          label-width="130px"
          label-position="left"
        >
          <el-col :span="22">
            <el-form-item :label="$t('lang.baseData.smallPC')">
              <el-select
                v-model="datas.submitForm.smallWeightSpecificationsType"
                class="m-2"
                style="width: 30%"
                placeholder=""
              >
                <el-option
                  v-for="(item, i) in datas.codeList2"
                  :key="i"
                  :label="item.dictionName"
                  :value="item.dictionCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="22"
            v-if="datas.submitForm.smallWeightSpecificationsType == '2'"
          >
            <el-form-item label="">
              <div>
                <div>
                  <el-form-item
                    :label="$t('lang.baseData.total')"
                    style="display: flex"
                    label-width="80px"
                  >
                    <el-input
                      v-model="datas.submitForm.smallTotalWeightInput"
                      style="width: 35%; margin-right: 20px"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1000"
                      oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      @blur="
                        formatWeight(
                          'smallTotalWeight',
                          '',
                          'smallTotalWeightUnit'
                        )
                      "
                    />
                    <el-select
                      v-model="datas.submitForm.smallTotalWeightUnit"
                      class="m-2"
                      style="width: 36%"
                      placeholder=""
                      @change="
                        formatWeight(
                          'smallTotalWeight',
                          '',
                          'smallTotalWeightUnit'
                        )
                      "
                    >
                      <el-option
                        v-for="item in WeighKg"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div style="margin-top: 10px">
                  <el-form-item
                    :label="$t('lang.baseData.pc')"
                    style="display: flex"
                    label-width="80px"
                  >
                    <div>
                      -
                      <el-input
                        v-model="datas.submitForm.smallWeightLowerLimitInput"
                        style="width: 80%"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1000"
                        oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        @blur="
                          formatWeight(
                            'smallWeightLowerLimit',
                            '',
                            'smallWeightSuperiorLimitUnit'
                          )
                        "
                      />
                    </div>
                    <span style="width: 40px"> ~ </span>
                    <div>
                      +
                      <el-input
                        v-model="datas.submitForm.smallWeightSuperiorLimitInput"
                        style="width: 80%"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1000"
                        oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        @blur="
                          formatWeight(
                            'smallWeightSuperiorLimit',
                            '',
                            'smallWeightSuperiorLimitUnit'
                          )
                        "
                      />
                    </div>
                    <el-select
                      v-model="datas.submitForm.smallWeightSuperiorLimitUnit"
                      class="m-2"
                      style="width: 45%"
                      placeholder=""
                      @change="
                        formatWeight('WeightSuperiorLimitUnit', 'small', '')
                      "
                    >
                      <el-option
                        v-for="item in WeighKg"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col
            :span="22"
            v-if="datas.submitForm.smallWeightSpecificationsType == '1'"
          >
            <el-form-item label="">
              <div>
                <el-form-item
                  :label="$t('lang.baseData.oneZL')"
                  style="display: flex"
                  label-width="100px"
                >
                  <el-input
                    v-model="datas.submitForm.smallUnitWeightInput"
                    style="width: 40%; margin-right: 20px"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1000"
                    oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    @blur="
                      formatWeight('smallUnitWeight', '', 'smallUnitWeightUnit')
                    "
                  />
                  <el-select
                    v-model="datas.submitForm.smallUnitWeightUnit"
                    class="m-2"
                    style="width: 38%"
                    placeholder=""
                    @change="
                      formatWeight('smallUnitWeight', '', 'smallUnitWeightUnit')
                    "
                  >
                    <el-option
                      v-for="item in WeighKg"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('lang.baseData.ZXnum')"
                  style="display: flex; margin-top: 10px"
                  label-width="100px"
                >
                  <el-input
                    v-model="datas.submitForm.smallPackingQuantity"
                    style="width: 40%; margin-right: 20px"
                    type="number"
                    step="1"
                    min="0"
                    max="1000"
                    oninput="if(value<0)value=0;"
                  />{{ $t('lang.baseData.jian') }}
                </el-form-item>
                <el-form-item
                  :label="$t('lang.baseData.WaiZL')"
                  style="display: flex; margin-top: 10px"
                  label-width="100px"
                >
                  <el-input
                    v-model="datas.submitForm.smallOuterPackagingWeightInput"
                    style="width: 40%; margin-right: 20px"
                    type="number"
                    step="0.01"
                    oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    @blur="
                      formatWeight(
                        'smallOuterPackagingWeight',
                        '',
                        'smallOuterPackagingWeightUnit'
                      )
                    "
                  />
                  <el-select
                    v-model="datas.submitForm.smallOuterPackagingWeightUnit"
                    class="m-2"
                    style="width: 38%"
                    placeholder=""
                    @change="
                      formatWeight(
                        'smallOuterPackagingWeight',
                        '',
                        'smallOuterPackagingWeightUnit'
                      )
                    "
                  >
                    <el-option
                      v-for="item in WeighKg"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('lang.baseData.pc')"
                  style="display: flex; margin-top: 10px"
                  label-width="100px"
                >
                  <div>
                    -
                    <el-input
                      v-model="datas.submitForm.smallWeightLowerLimitInput"
                      style="width: 80%"
                      type="number"
                      step="0.01"
                      oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      @blur="
                        formatWeight(
                          'smallWeightLowerLimit',
                          '',
                          'smallWeightSuperiorLimitUnit'
                        )
                      "
                    />
                  </div>
                  <span style="width: 30px"> ~ </span>
                  <div>
                    +
                    <el-input
                      v-model="datas.submitForm.smallWeightSuperiorLimitInput"
                      style="width: 80%"
                      type="number"
                      step="0.01"
                      oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      @blur="
                        formatWeight(
                          'smallWeightSuperiorLimit',
                          '',
                          'smallWeightSuperiorLimitUnit'
                        )
                      "
                    />
                  </div>
                  <el-select
                    v-model="datas.submitForm.smallWeightSuperiorLimitUnit"
                    class="m-2"
                    style="width: 80%"
                    placeholder=""
                    @change="
                      formatWeight('WeightSuperiorLimitUnit', 'small', '')
                    "
                  >
                    <el-option
                      v-for="item in WeighKg"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item :label="$t('lang.baseData.midPC')">
              <el-select
                v-model="datas.submitForm.mediumWeightSpecificationsType"
                class="m-2"
                style="width: 30%"
                placeholder=""
              >
                <el-option
                  v-for="(item, i) in datas.codeList2"
                  :key="i"
                  :label="item.dictionName"
                  :value="item.dictionCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="22"
            v-if="datas.submitForm.mediumWeightSpecificationsType == '2'"
          >
            <el-form-item label="">
              <div>
                <div>
                  <el-form-item
                    :label="$t('lang.baseData.total')"
                    style="display: flex"
                    label-width="80px"
                  >
                    <el-input
                      v-model="datas.submitForm.mediumTotalWeightInput"
                      style="width: 35%; margin-right: 20px"
                      type="number"
                      step="0.01"
                      oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      @blur="
                        formatWeight(
                          'mediumTotalWeight',
                          '',
                          'mediumTotalWeightUnit'
                        )
                      "
                    />
                    <el-select
                      v-model="datas.submitForm.mediumTotalWeightUnit"
                      class="m-2"
                      style="width: 36%"
                      placeholder=""
                      @change="
                        formatWeight(
                          'mediumTotalWeight',
                          '',
                          'mediumTotalWeightUnit'
                        )
                      "
                    >
                      <el-option
                        v-for="item in WeighKg"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div style="margin-top: 10px">
                  <el-form-item
                    :label="$t('lang.baseData.pc')"
                    style="display: flex"
                    label-width="80px"
                  >
                    <div>
                      -
                      <el-input
                        v-model="datas.submitForm.mediumWeightLowerLimitInput"
                        style="width: 80%"
                        type="number"
                        step="0.01"
                        oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        @blur="
                          formatWeight(
                            'mediumWeightLowerLimit',
                            '',
                            'mediumWeightSuperiorLimitUnit'
                          )
                        "
                      />
                    </div>
                    <span style="width: 60px"> ~ </span>
                    <div>
                      +
                      <el-input
                        v-model="
                          datas.submitForm.mediumWeightSuperiorLimitInput
                        "
                        style="width: 80%"
                        type="number"
                        step="0.01"
                        oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        @blur="
                          formatWeight(
                            'mediumWeightSuperiorLimit',
                            '',
                            'mediumWeightSuperiorLimitUnit'
                          )
                        "
                      />
                    </div>
                    <el-select
                      v-model="datas.submitForm.mediumWeightSuperiorLimitUnit"
                      class="m-2"
                      style="width: 70%"
                      placeholder=""
                      @change="
                        formatWeight('WeightSuperiorLimitUnit', 'medium', '')
                      "
                    >
                      <el-option
                        v-for="item in WeighKg"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col
            :span="22"
            v-if="datas.submitForm.mediumWeightSpecificationsType == '1'"
          >
            <el-form-item label="">
              <div>
                <el-form-item
                  :label="$t('lang.baseData.oneZL')"
                  style="display: flex"
                  label-width="100px"
                >
                  <el-input
                    v-model="datas.submitForm.mediumUnitWeightInput"
                    style="width: 40%; margin-right: 20px"
                    type="number"
                    step="0.01"
                    oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    @blur="
                      formatWeight(
                        'mediumUnitWeight',
                        '',
                        'mediumUnitWeightUnit'
                      )
                    "
                  />
                  <el-select
                    v-model="datas.submitForm.mediumUnitWeightUnit"
                    class="m-2"
                    style="width: 38%"
                    placeholder=""
                    @change="
                      formatWeight(
                        'mediumUnitWeight',
                        '',
                        'mediumUnitWeightUnit'
                      )
                    "
                  >
                    <el-option
                      v-for="item in WeighKg"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('lang.baseData.ZXnum')"
                  style="display: flex; margin-top: 10px"
                  label-width="100px"
                >
                  <el-input
                    v-model="datas.submitForm.mediumPackingQuantity"
                    type="number"
                    step="1"
                    oninput="if(value>1000)value=1000;if(value<0)value=0"
                    style="width: 40%; margin-right: 20px"
                  />{{ $t('lang.baseData.jian') }}
                </el-form-item>
                <el-form-item
                  :label="$t('lang.baseData.WaiZL')"
                  style="display: flex; margin-top: 10px"
                  label-width="100px"
                >
                  <el-input
                    v-model="datas.submitForm.mediumOuterPackagingWeightInput"
                    style="width: 40%; margin-right: 20px"
                    type="number"
                    step="0.01"
                    oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    @blur="
                      formatWeight(
                        'mediumOuterPackagingWeight',
                        '',
                        'mediumOuterPackagingWeightUnit'
                      )
                    "
                  />
                  <el-select
                    v-model="datas.submitForm.mediumOuterPackagingWeightUnit"
                    class="m-2"
                    style="width: 38%"
                    placeholder=""
                    @change="
                      formatWeight(
                        'mediumOuterPackagingWeight',
                        '',
                        'mediumOuterPackagingWeightUnit'
                      )
                    "
                  >
                    <el-option
                      v-for="item in WeighKg"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('lang.baseData.pc')"
                  style="display: flex; margin-top: 10px"
                  label-width="100px"
                >
                  <div>
                    -
                    <el-input
                      v-model="datas.submitForm.mediumWeightLowerLimitInput"
                      style="width: 80%"
                      type="number"
                      step="0.01"
                      oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      @blur="
                        formatWeight(
                          'mediumWeightLowerLimit',
                          '',
                          'mediumWeightSuperiorLimitUnit'
                        )
                      "
                    />
                  </div>
                  <span style="width: 30px"> ~ </span>
                  <div>
                    +
                    <el-input
                      v-model="datas.submitForm.mediumWeightSuperiorLimitInput"
                      style="width: 80%"
                      type="number"
                      step="0.01"
                      oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      @blur="
                        formatWeight(
                          'mediumWeightSuperiorLimit',
                          '',
                          'mediumWeightSuperiorLimitUnit'
                        )
                      "
                    />
                  </div>
                  <el-select
                    v-model="datas.submitForm.mediumWeightSuperiorLimitUnit"
                    class="m-2"
                    style="width: 80%"
                    placeholder=""
                    @change="
                      formatWeight('WeightSuperiorLimitUnit', 'medium', '')
                    "
                  >
                    <el-option
                      v-for="item in WeighKg"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item :label="$t('lang.baseData.bigPC')">
              <el-select
                v-model="datas.submitForm.bigWeightSpecificationsType"
                class="m-2"
                style="width: 30%"
                placeholder=""
              >
                <el-option
                  v-for="(item, i) in datas.codeList2"
                  :key="i"
                  :label="item.dictionName"
                  :value="item.dictionCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="22"
            v-if="datas.submitForm.bigWeightSpecificationsType == '2'"
          >
            <el-form-item label="">
              <div>
                <div>
                  <el-form-item
                    :label="$t('lang.baseData.total')"
                    style="display: flex"
                    label-width="80px"
                  >
                    <el-input
                      v-model="datas.submitForm.bigTotalWeightInput"
                      style="width: 35%; margin-right: 20px"
                      type="number"
                      step="0.01"
                      oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      @blur="
                        formatWeight('bigTotalWeight', '', 'bigTotalWeightUnit')
                      "
                    />
                    <el-select
                      v-model="datas.submitForm.bigTotalWeightUnit"
                      class="m-2"
                      style="width: 36%"
                      placeholder=""
                      @change="
                        formatWeight('bigTotalWeight', '', 'bigTotalWeightUnit')
                      "
                    >
                      <el-option
                        v-for="item in WeighKg"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div style="margin-top: 10px">
                  <el-form-item
                    :label="$t('lang.baseData.pc')"
                    style="display: flex"
                    label-width="80px"
                  >
                    <div>
                      -
                      <el-input
                        v-model="datas.submitForm.bigWeightLowerLimitInput"
                        style="width: 80%"
                        type="number"
                        step="0.01"
                        oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        @blur="
                          formatWeight(
                            'bigWeightLowerLimit',
                            '',
                            'bigWeightSuperiorLimitUnit'
                          )
                        "
                      />
                    </div>
                    <span style="width: 60px"> ~ </span>
                    <div>
                      +
                      <el-input
                        v-model="datas.submitForm.bigWeightSuperiorLimitInput"
                        style="width: 80%"
                        type="number"
                        step="0.01"
                        oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                        @blur="
                          formatWeight(
                            'bigWeightSuperiorLimit',
                            '',
                            'bigWeightSuperiorLimitUnit'
                          )
                        "
                      />
                    </div>
                    <el-select
                      v-model="datas.submitForm.bigWeightSuperiorLimitUnit"
                      class="m-2"
                      style="width: 70%"
                      placeholder=""
                      @change="
                        formatWeight('WeightSuperiorLimitUnit', 'big', '')
                      "
                    >
                      <el-option
                        v-for="item in WeighKg"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col
            :span="22"
            v-if="datas.submitForm.bigWeightSpecificationsType == '1'"
          >
            <el-form-item label="">
              <div>
                <el-form-item
                  :label="$t('lang.baseData.oneZL')"
                  style="display: flex"
                  label-width="100px"
                >
                  <el-input
                    v-model="datas.submitForm.bigUnitWeightInput"
                    style="width: 40%; margin-right: 20px"
                    type="number"
                    step="0.01"
                    oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    @blur="
                      formatWeight('bigUnitWeight', '', 'bigUnitWeightUnit')
                    "
                  />
                  <el-select
                    v-model="datas.submitForm.bigUnitWeightUnit"
                    class="m-2"
                    style="width: 38%"
                    placeholder=""
                    @change="
                      formatWeight('bigUnitWeight', '', 'bigUnitWeightUnit')
                    "
                  >
                    <el-option
                      v-for="item in WeighKg"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('lang.baseData.ZXnum')"
                  style="display: flex; margin-top: 10px"
                  label-width="100px"
                >
                  <el-input
                    v-model="datas.submitForm.bigPackingQuantity"
                    type="number"
                    step="1"
                    oninput="if(value>1000)value=1000;if(value<0)value=0"
                    style="width: 40%; margin-right: 20px"
                  />{{ $t('lang.baseData.jian') }}
                </el-form-item>
                <el-form-item
                  :label="$t('lang.baseData.WaiZL')"
                  style="display: flex; margin-top: 10px"
                  label-width="100px"
                >
                  <el-input
                    v-model="datas.submitForm.bigOuterPackagingWeightInput"
                    style="width: 40%; margin-right: 20px"
                    type="number"
                    step="0.01"
                    oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                    @blur="
                      formatWeight(
                        'bigOuterPackagingWeight',
                        '',
                        'bigOuterPackagingWeightUnit'
                      )
                    "
                  />
                  <el-select
                    v-model="datas.submitForm.bigOuterPackagingWeightUnit"
                    class="m-2"
                    style="width: 38%"
                    placeholder=""
                    @change="
                      formatWeight(
                        'bigOuterPackagingWeight',
                        '',
                        'bigOuterPackagingWeightUnit'
                      )
                    "
                  >
                    <el-option
                      v-for="item in WeighKg"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :label="$t('lang.baseData.pc')"
                  style="display: flex; margin-top: 10px"
                  label-width="100px"
                >
                  <div>
                    -
                    <el-input
                      v-model="datas.submitForm.bigWeightLowerLimitInput"
                      style="width: 80%"
                      type="number"
                      step="0.01"
                      oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      @blur="
                        formatWeight(
                          'bigWeightLowerLimit',
                          '',
                          'bigWeightSuperiorLimitUnit'
                        )
                      "
                    />
                  </div>
                  <span style="width: 30px"> ~ </span>
                  <div>
                    +
                    <el-input
                      v-model="datas.submitForm.bigWeightSuperiorLimitInput"
                      style="width: 80%"
                      type="number"
                      step="0.01"
                      oninput="if(value>1000)value=1000;if(value<0)value=0;if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                      @blur="
                        formatWeight(
                          'bigWeightSuperiorLimit',
                          '',
                          'bigWeightSuperiorLimitUnit'
                        )
                      "
                    />
                  </div>
                  <el-select
                    v-model="datas.submitForm.bigWeightSuperiorLimitUnit"
                    class="m-2"
                    style="width: 80%"
                    placeholder=""
                    @change="formatWeight('WeightSuperiorLimitUnit', 'big', '')"
                  >
                    <el-option
                      v-for="item in WeighKg"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{
          $t('lang.common.cancel')
        }}</el-button>
        <el-button type="primary" @click="SaveInfo" :loading="datas.loading">
          {{ $t('lang.common.comfirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import {
    ref,
    reactive,
    nextTick,
    getCurrentInstance,
    onMounted,
    computed
  } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { TabsPaneContext } from 'element-plus'
  import { useDictData } from '@/hooks/dictMinxin'
  import { useCallback } from '@/hooks/useCallback'
  import { useConfirm } from '@/hooks/useConfirm'
  // // const codeList = useDictionary('10001').codeList;
  // const codeList1= useDictionary('10002').codeList;
  console.log()

  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t

  interface Datas {
    title: string
    submitForm: any
    activeName: string
    weightValue: string
    loading: boolean
    codeList1: any
    codeList2: any
    codeList3: any
  }
  interface Props {
    editData: any
  }

  const { editData } = defineProps<Props>()
  let data = { ...editData }
  const emit = defineEmits(['success', 'close'])
  const WeighKg: Object[] | any = [
    {
      value: '1',
      text: $t('lang.baseData.g')
    },
    {
      value: '2',
      text: $t('lang.baseData.kg')
    }
  ]

  let datas: Datas = reactive({
    title: $t('lang.baseData.wlBaseInfo'),
    submitForm: {
      id: null,
      matterCode: '',
      matterName: '',
      matterSupplierCode: '',
      matterType: '',
      matterUnit: '',
      matterDescribe: '',
      productClassification: '1',
      smallTotalWeight: null, //小包总重量
      smallTotalWeightInput: null,
      smallTotalWeightUnit: '1',
      smallUnitWeight: null, //小包单件重量
      smallUnitWeightInput: null,
      smallUnitWeightUnit: '1',
      smallPackingQuantity: null, //小包装箱数量
      smallOuterPackagingWeight: null, //小包外包装重量
      smallOuterPackagingWeightInput: null,
      smallOuterPackagingWeightUnit: '1',
      smallWeightLowerLimit: null, //小包下限
      smallWeightLowerLimitInput: null,
      smallWeightLowerLimitUnit: '1',
      smallWeightSuperiorLimit: null, //小包上限
      smallWeightSuperiorLimitInput: null,
      smallWeightSuperiorLimitUnit: '1',
      smallWeightSpecificationsType: '2',
      mediumTotalWeight: null, //中包总重量
      mediumTotalWeightInput: null,
      mediumTotalWeightUnit: '1',
      mediumUnitWeight: null, //中包单件重量
      mediumUnitWeightInput: null,
      mediumUnitWeightUnit: '1',
      mediumPackingQuantity: null, //中包装箱数量
      mediumOuterPackagingWeight: null, //中包外包装重量
      mediumOuterPackagingWeightInput: null,
      mediumOuterPackagingWeightUnit: '1',
      mediumWeightLowerLimit: null, //中包下限
      mediumWeightLowerLimitInput: null,
      mediumWeightLowerLimitUnit: '1',
      mediumWeightSuperiorLimit: null, //中包上限
      mediumWeightSuperiorLimitInput: null,
      mediumWeightSuperiorLimitUnit: '1',
      mediumWeightSpecificationsType: '2',
      bigTotalWeight: null, //外包总重量
      bigTotalWeightInput: null,
      bigTotalWeightUnit: '1',
      bigUnitWeight: null, //外包单件重量
      bigUnitWeightInput: null,
      bigUnitWeightUnit: '1',
      bigPackingQuantity: null, //外包装箱数量
      bigOuterPackagingWeight: null, //外包外包装重量
      bigOuterPackagingWeightInput: null,
      bigOuterPackagingWeightUnit: '1',
      bigWeightLowerLimit: null, //外包下限
      bigWeightLowerLimitInput: null,
      bigWeightLowerLimitUnit: '1',
      bigWeightSuperiorLimit: null, //外包上限
      bigWeightSuperiorLimitInput: null,
      bigWeightSuperiorLimitUnit: '1',
      bigWeightSpecificationsType: '2'
    },
    activeName: 'first',
    weightValue: '1',
    loading: false,
    codeList1: [],
    codeList2: [],
    codeList3: []
  })
  if (data.id) {
    nextTick(() => {
      datas.title = $t('lang.baseData.wlBaseInfo')
      datas.submitForm = data
      if (datas.submitForm.smallWeightSpecificationsType == null) {
        datas.submitForm.smallTotalWeightUnit = '1'
        datas.submitForm.smallUnitWeightUnit = '1'
        datas.submitForm.smallOuterPackagingWeightUnit = '1'
        datas.submitForm.smallWeightSuperiorLimitUnit = '1'
      }
      if (datas.submitForm.mediumWeightSpecificationsType == null) {
        datas.submitForm.mediumTotalWeightUnit = '1'
        datas.submitForm.mediumUnitWeightUnit = '1'
        datas.submitForm.mediumOuterPackagingWeightUnit = '1'
        datas.submitForm.mediumWeightSuperiorLimitUnit = '1'
      }
      if (datas.submitForm.bigWeightSpecificationsType == null) {
        datas.submitForm.bigTotalWeightUnit = '1'
        datas.submitForm.bigUnitWeightUnit = '1'
        datas.submitForm.bigOuterPackagingWeightUnit = '1'
        datas.submitForm.bigWeightSuperiorLimitUnit = '1'
      }
    })
  }
  const { getDictData } = useDictData()

  onMounted(async () => {
    datas.codeList1 = await getDictData('10001')
    datas.codeList2 = await getDictData('10002')
    datas.codeList3 = await getDictData('10003')
  })
  const dialogVisible = ref(true)
  const handleCancel = () => {
    emit('close')
  }
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
  const SaveInfo = () => {
    datas.loading = true
    let params = {
      ...datas.submitForm
    }
    if (!data.id) {
      useConfirm(AddInfo, params, $t('lang.common.plzSubmit') + '!')
    } else {
      useConfirm(EditInfo, params, $t('lang.common.plzSubmit') + '!')
    }
  }
  const formatWeight = (str: any, type: any, UnitStr: any) => {
    if (str == 'WeightSuperiorLimitUnit') {
      if (datas.submitForm[type + str] == '2') {
        datas.submitForm[type + 'WeightLowerLimit'] =
          datas.submitForm[type + 'WeightLowerLimitInput'] * 1000
        datas.submitForm[type + 'WeightSuperiorLimit'] =
          datas.submitForm[type + 'WeightSuperiorLimitInput'] * 1000
      } else if (datas.submitForm[type + str] == '1') {
        datas.submitForm[type + 'WeightLowerLimit'] =
          datas.submitForm[type + 'WeightLowerLimitInput'] * 1
        datas.submitForm[type + 'WeightSuperiorLimit'] =
          datas.submitForm[type + 'WeightSuperiorLimitInput'] * 1
      }
    } else {
      if (datas.submitForm[UnitStr] == '2') {
        datas.submitForm[str] = datas.submitForm[str + 'Input'] * 1000
      } else if (datas.submitForm[UnitStr] == '1') {
        datas.submitForm[str] = datas.submitForm[str + 'Input'] * 1
      }
    }
  }
  const AddInfo = (params: any) => {
    proxy.$api.MaterialInfo.addMatter(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.AddSuc') + '!')
      if (data) search()
    })
  }
  const EditInfo = (params: any) => {
    proxy.$api.MaterialInfo.addUpdate(params).then((res: any) => {
      datas.loading = false
      const data = useCallback(res, $t('lang.common.EditSuc') + '!')
      if (data) search()
    })
  }
  const search = () => {
    emit('close')
    emit('success')
  }
</script>

<style scoped lang="less">
  .el-form {
    margin: 10px 0;
  }

  .el-form-item__content {
    flex-wrap: nowrap;
  }
</style>
<style>
  .DiyDialog .el-dialog__body {
    padding: 0 30px;
  }

  .DiyDialog .el-select {
    width: 100%;
  }

  .DiyDialog .el-form-item__content {
    flex-wrap: nowrap;
  }
</style>
