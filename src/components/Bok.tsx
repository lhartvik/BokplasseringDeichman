import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { styles } from "./Bokliste";

type BokProps = {
  tittel: string,
  locLabel: string,
  shelfmark: string,
  isDarkMode: boolean,
  handleDelete: () => {};
}

const BokView = ({tittel, locLabel, shelfmark, isDarkMode, handleDelete} : BokProps) => (
  <View
    style={{
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
      borderBottomColor: !isDarkMode ? Colors.black : Colors.white,
      borderBottomWidth: StyleSheet.hairlineWidth,
    }}>
    <Text style={styles.bookTitle}>{tittel+':'}</Text>
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <Text>{locLabel + ' ' + shelfmark}</Text>
      </View>
      <Button title={'Slett'} onPress={handleDelete} />
    </View>
  </View>
)

export default BokView;
