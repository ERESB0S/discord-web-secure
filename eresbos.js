client.on("presenceUpdate", async (eski, yeni) => {
  const eresbos = Object.keys(yeni.user.presence.clientStatus);
  const embed = new MessageEmbed();
  const kanal = client.channels.cache.find((e) => e.id === "log_kanal_id");
  const roller = yeni.member.roles.cache.filter((e) => e.editable && e.name !== "@everyone" && [8, 4, 2, 16, 32, 268435456, 536870912, 134217728, 128].some((a) => e.permissions.has(a)));
  if (!yeni.user.bot && yeni.guild.id === config.guildID && [8, 4, 2, 16, 32, 268435456, 536870912, 134217728, 128].some((e) => yeni.member.permissions.has(e)) ) {
    const sunucu = client.guilds.cache.get(config.guildID);
    if (sunucu.ownerID === yeni.user.id) return;
    if (eresbos.find(e => e === "web")) {
      await userRoles.findOneAndUpdate({ guildID: config.guildID, userID: yeni.user.id }, { $set: { roles: roller.map((e) => e.id) } }, { upsert: true });
      await yeni.member.roles.remove(roller.map((e) => e.id), "Tarayıcıdan Giriş Yapıldığı İçin Rolleri Alındı.");
      if (kanal) kanal.send(embed.setDescription(`${yeni.user.toString()} tarayıcıdan giriş yaptığı için yetkileri alındı! \n\n**Rollerin Listesi:** \n${roller.map((e) => `<@&${e.id}>`).join("\n")}`).setAuthor(yeni.member.displayName, yeni.user.avatarURL({ dynamic: true })).setFooter(config.activity, client.guilds.cache.get(config.guildID).iconURL({ dynamic: true })).setTimestamp().setColor(yeni.member.displayHexColor));
    } 
  }
  if (!eresbos.find(e => e === "web")) {
    const veri = await userRoles.findOne({ guildID: config.guildID, userID: yeni.user.id });
    if (!veri) return;
    if (veri.roles || veri.roles.length) {
      await veri.roles.map(e => yeni.member.roles.add(e, "Tarayıcıdan Çıkış Yapıldığı İçin Rolleri Geri Verildi.").then(async () => {
        await userRoles.findOneAndDelete({ guildID: config.guildID, userID: yeni.user.id });
        if (kanal) kanal.send(embed.setDescription(`${yeni.user.toString()} tarayıcıdan çıkış yaptığı için yetkileri verildi! \n\n**Rollerin Listesi:** \n${veri.roles.map((e) => `<@&${e}>`).join("\n")}`).setAuthor(yeni.member.displayName, yeni.user.avatarURL({ dynamic: true })).setFooter(config.activity, client.guilds.cache.get(config.guildID).iconURL({ dynamic: true })).setTimestamp().setColor(yeni.member.displayHexColor));
      }).catch(() => {}));
    }
  }
});
