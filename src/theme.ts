/**
 * 스타일 가이드
 * 2019.11.12
 * https://app.zeplin.io/project/5c3d48f3182f8e339c8914cf/screen/5dba6a179ca4192c4b98f566
 */

// 1rem = 0~1599px: 16px, 1600px~: 20px

interface RgbAttr {
  r: number
  g: number
  b: number
}

export interface ThemeAttrs {
  //space_* : 반응형 margin, padding
  space_1: string
  space_2: string
  space_3: string
  space_4: string
  space_5: string

  //fontsize_* : 반응형 폰트 사이즈, 고정 사이즈의 경우 테마 이용하지 않고 각각 대응
  fontsize_1: string
  fontsize_2: string
  fontsize_3: string
  fontsize_4: string
  fontsize_5: string

  // color & border color
  primary_color: string
  disabled_color: string
  border_color_1: string
  border_color_2: string
  border_color_3: string

  header_title_color: string

  // background color
  bg_color: string
  bg_font_color: string
  bg_color_component: string
  bg_input_color: string
  bg_header_color: string
  bg_modal_color: string
  bg_primary_color: string
  bg_hover_color: string

  bg_disabled_color: string
  bg_normal_color: string
  bg_good_color: string
  bg_good_table_color: string
  bg_good_hover_color: string
  bg_warning_color: string
  bg_warning_table_color: string
  bg_warning_hover_color: string
  bg_critical_color: string
  bg_critical_table_color: string
  bg_critical_hover_color: string
  bg_success_color: string
  bg_info_color: string
  bg_info_table_color: string
  bg_info_hover_color: string
  bg_white_color: string

  bg_modal_header_color: string

  // Product Type Color
  application: string
  container: string
  server: string
  database: string
  url: string

  // Box Shadow
  box_shadow1: string
  box_shadow2: string
  box_shadow3: string

  //Active Transaction Chart Color
  at_live: string

  //Chart Event Color
  bg_warning_1: string
  normal_1: string
  normal_2: string
  normal_3: string

  //Chart Color Active Status _s의 경우 그라데이션 시작 색상 _e 의경우 끝 색상
  method_s: string
  method_e: string
  httpc_s: string
  httpc_e: string
  SQL_s: string
  SQL_e: string
  DBC_s: string
  DBC_e: string
  socket_s: string
  socket_e: string

  // Profile Colors
  profile_parameters: string
  profile_result_set: string
  profile_dbc: string
  profile_httpc: string
  profile_method: string

  // ActiveTx Colors
  active_tx_error: string
  active_tx_warn: string

  // URL HTTP Status
  http_status_etc: string
  http_status_1xx: string
  http_status_2xx: string
  http_status_3xx: string
  http_status_4xx: string
  http_status_5xx: string
  http_status_custom: string

  //Chart Color (차트 컬러)
  chart_1: string
  chart_2: string
  chart_3: string
  chart_4: string
  chart_5: string
  chart_6: string
  chart_7: string
  chart_8: string
  chart_9: string
  chart_10: string
  chart_11: string
  chart_12: string
  chart_13: string
  chart_14: string
  chart_15: string

  bg_sub_data_border: string
  bg_sub_data_fill: string

  border_guide_color: string

  //차트 컬러를 가지고 그라데이션을 만들기 위한 값 정의
  startColor: RgbAttr
  endColor: RgbAttr
  //StackColor를 무엇으로 할지
  stackColor: 'startColor' | 'endColor'
  [key: string]: string | RgbAttr
}

const baseTheme: ThemeAttrs = {
  space_1: '0.25rem',
  space_2: '0.5rem',
  space_3: '1rem',
  space_4: '1.5rem',
  space_5: '2rem',

  fontsize_1: '1rem',
  fontsize_2: '1.2rem',
  fontsize_3: '1.4rem',
  fontsize_4: '1.6rem',
  fontsize_5: '2rem',

  // 여기부터 color 관련 스타일
  primary_color: '#296CF2',
  disabled_color: '#D3D3D3',
  border_color_1: '#D3D3D3',
  border_color_2: '#999999',
  border_color_3: '#999999',

  header_title_color: '#666666',

  bg_color: '#F0F0F0',
  bg_header_color: '#FFFFFF',
  bg_modal_header_color: '#404040',
  bg_modal_color: '#222222',
  bg_font_color: '#222222',
  bg_color_component: '#FFFFFF',
  bg_input_color: '#FFFFFF',
  bg_primary_color: '#296CF2',
  bg_hover_color: 'rgba(41,108,242, 0.2)',
  bg_disabled_color: '#D3D3D3',
  bg_normal_color: '#757575',
  bg_good_color: '#00B543',
  bg_good_table_color: 'rgba(0, 181, 67, 0.4)',
  bg_good_hover_color: 'rgba(0, 181, 67, 0.2)',
  bg_warning_color: '#FF9900',
  bg_warning_table_color: 'rgba(255, 153, 0, 0.4)',
  bg_warning_hover_color: 'rgba(255, 153, 0, 0.2)',
  bg_critical_color: '#DF3737',
  bg_critical_table_color: 'rgba(255, 55, 55, 0.4)',
  bg_critical_hover_color: 'rgba(255, 55, 55, 0.2)',
  bg_success_color: '#296CF2',
  bg_info_color: '#999999',
  bg_info_table_color: 'rgba(153, 153, 153, 0.4)',
  bg_info_hover_color: 'rgba(153, 153, 153, 0.2)',
  bg_white_color: '#FFFFFF',

  // Product Type Color
  application: '#00B0E2',
  container: '#4485FF',
  server: '#00C5B1',
  database: '#936CE7',
  url: '#45B96E',

  //box shadow
  box_shadow1: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 1px 0 rgba(0, 0, 0, 0.14)',
  box_shadow2: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 4px 5px 0 rgba(0, 0, 0, 0.14)',
  box_shadow3: '0 4px 16px 2px rgba(0, 0, 0, 0.2), 0 4px 8px 0 rgba(0, 0, 0, 0.12)',

  // 여기부터 chart color
  at_live: '#E3F3FE',

  bg_warning_1: '#FFC107',
  normal_1: '#1999FF',
  normal_2: '#0078DC',
  normal_3: '#2A3CAA',

  method_s: '#73C2FC',
  method_e: '#ABE3FE',
  httpc_s: '#E485F1',
  httpc_e: '#F4BAF9',
  SQL_s: '#66D4D1',
  SQL_e: '#9FECEA',
  DBC_s: '#F09A82',
  DBC_e: '#F9CAB8',
  socket_s: '#DC558C',
  socket_e: '#F08EC0',

  profile_parameters: '#365fff',
  profile_result_set: '#00a29d',
  profile_dbc: '#bc714d',
  profile_httpc: '#9c42dc',
  profile_method: '#365fff',

  active_tx_error: '#c02cd3',
  active_tx_warn: '#7632ff',

  http_status_etc: '#ff4081',
  http_status_1xx: '#2196f3',
  http_status_2xx: '#00c853',
  http_status_3xx: '#0097a7',
  http_status_4xx: '#ffc107',
  http_status_5xx: '#f03e3e',
  http_status_custom: '#2196f3',

  chart_1: '#1999FF',
  chart_2: '#7632FF',
  chart_3: '#00BEB8',
  chart_4: '#C0CA33',
  chart_5: '#FF8200',
  chart_6: '#F77FF6',
  chart_7: '#C02CD3',
  chart_8: '#2AC3AA',
  chart_9: '#0088FF',
  chart_10: '#0076AC',
  chart_11: '#6CD890',
  chart_12: '#7BC131',
  chart_13: '#FFC132',
  chart_14: '#C85A3C',
  chart_15: '#8E5340',

  bg_sub_data_border: '#999999',
  bg_sub_data_fill: '#E6E6E6',

  border_guide_color: '#F0F0F0',

  // chart_* 의 컬러 값을 가지고 그라데이션을 만들기 위한 옵션
  startColor: {
    r: 100,
    g: 80,
    b: 50,
  },
  endColor: {
    r: 30,
    g: 30,
    b: 30,
  },
  stackColor: 'endColor',
}

export default baseTheme
