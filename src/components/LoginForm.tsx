// SPDX-FileCopyrightText: © 2019 EteSync Authors
// SPDX-License-Identifier: GPL-3.0-only

import * as React from "react";

import { Text, View, TextInput as NativeTextInput } from "react-native";
import { Switch, Button, HelperText, Paragraph, TouchableRipple } from "react-native-paper";

import Row from "../widgets/Row";
import TextInput from "../widgets/TextInput";

import PasswordInput from "../widgets/PasswordInput";

interface FormErrors {
  username?: string;
  password?: string;
  server?: string;
}

// Can be used to force always showing advance
const alwaysShowAdvanced = false;

interface PropsType {
  onSubmit: (username: string, password: string, serviceApiUrl: string) => void;
}

export default function LoginForm(props: PropsType) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [server, setServer] = React.useState("");
  const [showAdvanced, setShowAdvanced] = React.useState(alwaysShowAdvanced);
  const [errors, setErrors] = React.useState<FormErrors>({});

  const usernameRef = React.useRef<NativeTextInput>();
  const passwordRef = React.useRef<NativeTextInput>();
  const serverRef = React.useRef<NativeTextInput>();

  function onSubmit() {
    // There's no default server: the user must give theirs
    const serverUrl = server.trim();

    const errors: FormErrors = {};
    const fieldRequired = "This field is required!";
    if (!username) {
      errors.username = fieldRequired;
    }
    if (!password) {
      errors.password = fieldRequired;
    }
    if (!serverUrl) {
      errors.server = fieldRequired;
      // The field is under the advanced settings, so show it with its error
      setShowAdvanced(true);
    }

    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    props.onSubmit(username, password, serverUrl);
  }

  return (
    <>
      <View>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="username"
          autoFocus
          returnKeyType="next"
          onSubmitEditing={() => (passwordRef.current)!.focus()}
          ref={usernameRef}
          error={!!errors.username}
          onChangeText={setUsername}
          label="Username"
          accessibilityLabel="Username"
          value={username}
        />
        <HelperText
          type="error"
          visible={!!errors.username}
        >
          {errors.username}
        </HelperText>

        <PasswordInput
          autoCompleteType="password"
          returnKeyType={showAdvanced ? "next" : undefined}
          onSubmitEditing={() => serverRef.current?.focus()}
          ref={passwordRef}
          error={!!errors.password}
          label="Password"
          accessibilityLabel="Password"
          value={password}
          onChangeText={setPassword}
        />
        <HelperText
          type="error"
          visible={!!errors.password}
        >
          {errors.password}
        </HelperText>

        <TouchableRipple
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Row style={{ paddingVertical: 8, justifyContent: "space-between" }}>
            <Paragraph>Advanced settings</Paragraph>
            <View pointerEvents="none">
              <Switch value={showAdvanced} />
            </View>
          </Row>
        </TouchableRipple>

        {showAdvanced && (
          <>
            <TextInput
              keyboardType="url"
              textContentType="URL"
              autoCapitalize="none"
              autoCorrect={false}
              error={!!errors.server}
              label="Server URL"
              accessibilityLabel="Server URL"
              value={server}
              placeholder="E.g. https://etebase.example.com"
              onChangeText={setServer}
              ref={serverRef}
            />
            <HelperText
              type="error"
              visible={!!errors.server}
            >
              {errors.server}
            </HelperText>
          </>
        )}
        <HelperText
          type="error"
          visible={false}
        >
          <React.Fragment />
        </HelperText>

        <Button
          mode="contained"
          onPress={onSubmit}
        >
          <Text>Log In</Text>
        </Button>
      </View>
    </>
  );
}
