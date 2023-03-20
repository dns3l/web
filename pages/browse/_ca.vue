<template>
  <div v-if="!$fetchState.pending && !$fetchState.error">
    <div class="grid grid-cols-1 justify-items-center gap-2 m-8">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="prose max-w-fit" v-html="caHelp" />
          <div class="divider" />
          <table class="table table-compact overflow-x-auto">
            <thead>
              <tr>
                <td>Certificate name</td>
                <td>From (By)</td>
                <td>Expires</td>
                <td>Days left</td>
                <td>PEM</td>
                <td />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, i) in crts" :key="c.name" :class="{ active: ! (c.valid && isValid(c.validTo)) }" class="hover">
                <td>
                  <span class="whitespace-nowrap font-bold">
                    {{ c.name }}
                  </span>
                  <span class="whitespace-normal">
                    <span v-if="c.wildcard" class="badge badge-sm badge-info text-slate-50">wildcard</span>
                    <span v-if="c.renewCount > 0" class="badge badge-sm">{{ c.renewCount }}</span>
                  </span>
                  <br>
                  <span class="whitespace-nowrap text-xs font-light">
                    S/N: {{ c.serial }}
                  </span>
                </td>
                <td>
                  {{ formatDate(c.claimedOn, { dateStyle: 'medium' }) }}<br>
                  &lt;{{ c.claimedBy.email }}&gt;
                </td>
                <td>
                  {{ formatDate(c.validTo) }}
                </td>
                <td>
                  <div v-if="c.valid && isValid(c.validTo)" class="radial-progress bg-[#e20074] text-white border-4 border-[#e20074]" :style="'--size:2.5rem; --value:' + Math.round((daysLeft(c.validTo) / daysTTL(c.validFrom, c.validTo)) * 100)">
                    <b>{{ daysLeft(c.validTo) }}</b>
                  </div>
                </td>
                <!-- TODO: visualize that's loaded and copied -->
                <td class="whitespace-normal">
                  <div class="indicator">
                    <span :class="{ visible: c.certCopied, invisible: !c.certCopied }" class="indicator-item badge badge-sm">Copied!</span>
                    <button :disabled="! clipboard" :class="{ 'btn-success': c.loaded }" class="btn btn-xs normal-case" @click="getPEM(i, 'cert')">
                      Cert
                    </button>
                  </div>
                  <div class="indicator">
                    <span :class="{ visible: c.keyCopied, invisible: !c.keyCopied }" class="indicator-item badge badge-sm">Copied!</span>
                    <button :disabled="! clipboard" :class="{ 'btn-success': c.loaded }" class="btn btn-xs normal-case" @click="getPEM(i, 'key')">
                      Key
                    </button>
                  </div>
                  <!-- div class="indicator">
                    <span :class="{ visible: c.chainCopied, invisible: !c.chainCopied }" class="indicator-item badge badge-sm">Copied!</span>
                    <button :disabled="! clipboard" :class="{ 'btn-success': c.loaded }" class="btn btn-xs normal-case" @click="getPEM(i, 'chain')">
                      Chain
                    </button>
                  </div -->
                  <div class="indicator">
                    <span :class="{ visible: c.fullchainCopied, invisible: !c.fullchainCopied }" class="indicator-item badge badge-sm">Copied!</span>
                    <button :disabled="! clipboard" :class="{ 'btn-success': c.loaded }" class="btn btn-xs normal-case" @click="getPEM(i, 'fullchain')">
                      Fullchain
                    </button>
                  </div>
                </td>
                <td>
                  <button class="btn btn-xs btn-error text-slate-50 normal-case">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- nextTODO:
  Integrate help content
  Support DELETE
  PEM Viewer
-->

<script>
import _ from 'underscore'

export default {
  name: 'CaBrowse',
  data () {
    return {
      clipboard: false,
      ca: null,
      caHelpMarkdown: null,
      cas: [],
      crts: []
    }
  },
  async fetch () {
    this.cas = await fetch(this.$config.apiURL + '/ca',
      this.$fetchHeader(this.$auth.loggedIn ? this.$auth.strategy.idToken.get() : null))
      .then(res => res.json())
    if (_.findWhere(this.cas, { id: this.$route.params.ca }) != null) {
      this.ca = this.$route.params.ca
      this.crts = await fetch(this.$config.apiURL + '/ca/' + this.ca + '/crt',
        this.$fetchHeader(this.$auth.loggedIn ? this.$auth.strategy.idToken.get() : null))
        .then(res => res.json())
    } else {
      window.$nuxt.context.redirect('/browse')
    }
    const doc = 'https://raw.githubusercontent.com/dns3l/dns3l/master/docs/ca/' + this.ca + '.md'
    this.caHelpMarkdown = await fetch(doc)
      .then((response) => {
        if (!response.ok) { throw new Error('Network response was not OK') }
        return response.text()
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation: ', error)
        return '### Ooops...\nUnable to fetch ' + doc + '.'
      })
  },
  computed: {
    caName: function () { // eslint-disable-line
      return _.findWhere(this.cas, { id: this.ca }).name
    },
    caHelp: function () { // eslint-disable-line
      return this.$renderMarkdown(this.caHelpMarkdown)
    }
  },
  mounted () {
    if (navigator.clipboard) {
      this.clipboard = true
    }
  },
  methods: {
    isCertLoaded: function (i) { // eslint-disable-line
      return this.crts[i].loaded
    },
    async getPEM (i, p) { // eslint-disable-line
      if (this.crts[i][p + 'Copied'] === undefined) {
        this.$set(this.crts[i], p + 'Copied', null) // https://v2.vuejs.org/v2/guide/list.html#Caveats
      }
      if (this.crts[i].loaded === undefined) {
        this.$set(this.crts[i], 'loaded', false) // https://v2.vuejs.org/v2/guide/list.html#Caveats
      }
      const t = this // rescue this context
      if (this.crts[i].loaded) {
        // TODO: visualize that's copied
        navigator.clipboard.writeText(this.crts[i].pem[p])
          .then(() => {
            t.crts[i][p + 'Copied'] = true
            setTimeout((t, i) => { t.crts[i][p + 'Copied'] = null }, 1300, t, i)
          })
          .catch((e) => { })
      } else {
        this.crts[i].pem = await fetch(this.$config.apiURL + '/ca/' + this.ca + '/crt/' + this.crts[i].name + '/pem',
          this.$fetchHeader(this.$auth.loggedIn ? this.$auth.strategy.idToken.get() : null))
          .then((r) => {
            if (r.ok) {
              return r.json() // JSON response, unvalidated
            } else {
              return r.json()
                .catch(e => Promise.reject(new Error(r.status + ' ' + r.statusText)))
                .then(d => Promise.reject(new Error(r.status + ' ' + r.statusText + ' [' + d.message + ']')))
            }
          })
          .then((d) => {
            // TODO: visualize that's copied
            navigator.clipboard.writeText(d[p])
              .then(() => {
                t.crts[i][p + 'Copied'] = true
                setTimeout((t, i) => { t.crts[i][p + 'Copied'] = null }, 1300, t, i)
              })
              .catch((e) => { })
            t.crts[i].loaded = true
            return d
          })
          .catch((e) => {
            // TODO: visualize the error
          })
      }
      // alert(JSON.stringify(this.crts[i], null, ' '))
    },
    formatDate: function (d, o) { // eslint-disable-line
      return new Date(d).toLocaleString('de-DE', o ? o : { dateStyle: 'medium', timeStyle: 'medium' }) // eslint-disable-line
    },
    isValid: function (d) { // eslint-disable-line
      return new Date(d) > Date.now() // validTo > now
    },
    daysTTL: function (f, t) { // eslint-disable-line
      return Math.floor((new Date(t) - new Date(f)) / 1000 / 60 / 60 / 24)
    },
    daysLeft: function (d) { // eslint-disable-line
      return Math.floor((new Date(d) - Date.now()) / 1000 / 60 / 60 / 24)
    }
  }
}
</script>
